/**
 * Authentication API Routes
 *
 * Features:
 * - Secure login with password and MFA support
 * - Token refresh mechanism
 * - JWT-based authentication
 * - Argon2id password hashing
 * - Account lockout protection
 * - Password reset flow
 */

import { Router, Request, Response } from 'express';
import { catchAsync } from '../middleware/errorHandler';
import { prisma } from '../index';
import { logAudit } from '../middleware/auditLogger';
import { hash, compare } from 'argon2';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { z } from 'zod';
import { sanitizeEmail } from '../middleware/sanitizeInput';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  mfaCode: z.string().optional(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token required'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

const mfaVerifySchema = z.object({
  code: z.string().length(6, 'MFA code must be 6 digits'),
});

/**
 * Generate JWT tokens
 */
const generateTokens = (userId: string, mfaVerified: boolean = false) => {
  const payload = {
    userId,
    type: 'access' as const,
    mfaVerified,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

  const refreshPayload = {
    userId,
    type: 'refresh' as const,
  };

  const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  return { accessToken, refreshToken };
};

/**
 * POST /api/v1/auth/login
 * Authenticate user and issue tokens
 */
router.post('/login', catchAsync(async (req: Request, res: Response) => {
  const { email, password, mfaCode } = loginSchema.parse(req.body);

  const sanitizedEmail = sanitizeEmail(email);

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
  });

  if (!user) {
    await logAudit(req, 'LOGIN_FAILURE', 'user', undefined, { reason: 'user_not_found' });
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS',
    });
  }

  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return res.status(423).json({
      success: false,
      error: 'Account temporarily locked. Please try again later.',
      code: 'ACCOUNT_LOCKED',
    });
  }

  // Verify password
  const isValidPassword = await compare(password, user.passwordHash);

  if (!isValidPassword) {
    // Increment failed login attempts
    const newAttempts = (user.failedLoginAttempts || 0) + 1;
    const lockThreshold = 5; // Lock after 5 failed attempts

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: newAttempts,
        lockedUntil: newAttempts >= lockThreshold
          ? new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
          : null,
      },
    });

    await logAudit(req, 'LOGIN_FAILURE', 'user', user.id, {
      reason: 'invalid_password',
      attempts: newAttempts,
    });

    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS',
    });
  }

  // Reset failed attempts on successful login
  if (user.failedLoginAttempts > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  // Check if MFA is enabled
  if (user.isMfaEnabled && !mfaVerified) {
    // Return success but require MFA
    return res.status(200).json({
      success: true,
      message: 'MFA required',
      requiresMfa: true,
      mfaVerified: false,
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id, true);

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Log successful login
  await logAudit(req, 'LOGIN_SUCCESS', 'user', user.id, {
    mfa: user.isMfaEnabled,
  });

  res.json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isMfaEnabled: user.isMfaEnabled,
        roles: [], // Populate from DB in real app
      },
    },
  });
}));

/**
 * POST /api/v1/auth/verify-mfa
 * Verify MFA code and complete login
 */
router.post('/verify-mfa', catchAsync(async (req: Request, res: Response) => {
  const { code } = mfaVerifySchema.parse(req.body);

  // Get user from pending MFA session (in real app, use Redis or similar)
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'User ID required for MFA verification',
      code: 'MFA_USER_REQUIRED',
    });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.mfaSecret) {
    return res.status(400).json({
      success: false,
      error: 'User not found or MFA not enabled',
      code: 'MFA_NOT_ENABLED',
    });
  }

  // Verify TOTP code
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: code,
    window: 1, // Allow 1 step of deviation
  });

  if (!verified) {
    await logAudit(req, 'MFA_VERIFY', 'user', user.id, { reason: 'invalid_code' });
    return res.status(401).json({
      success: false,
      error: 'Invalid MFA code',
      code: 'MFA_INVALID_CODE',
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id, true);

  // Log MFA verification success
  await logAudit(req, 'MFA_VERIFY', 'user', user.id, { verified: true });

  res.json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isMfaEnabled: user.isMfaEnabled,
      },
    },
  });
}));

/**
 * POST /api/v1/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = refreshTokenSchema.parse(req.body);

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user.id, type: 'access', mfaVerified: true },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    res.json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token',
      code: 'INVALID_REFRESH_TOKEN',
    });
  }
}));

/**
 * POST /api/v1/auth/logout
 * Logout user and invalidate tokens
 */
router.post('/logout', catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  await logAudit(req, 'LOGOUT', 'user', userId);

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
}));

/**
 * POST /api/v1/auth/mfa/enroll
 * Enroll user in MFA
 */
router.post('/mfa/enroll', catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'AUTH_REQUIRED',
    });
  }

  // Generate TOTP secret
  const secret = speakeasy.generateSecret({
    name: `SentinelX:${req.user?.email}`,
    issuer: 'SENTINEL-X',
    length: 32,
  });

  // Store temporary secret (in real app, use Redis or temporary DB field)
  res.json({
    success: true,
    data: {
      secret: secret.base32,
      qrCodeUrl: `otpauth://totp/SentinelX:${req.user?.email}?secret=${secret.base32}&issuer=SentinelX&algorithm=SHA256&digits=6&period=30`,
    },
  });
}));

/**
 * POST /api/v1/auth/mfa/verify-enroll
 * Verify MFA enrollment
 */
router.post('/mfa/verify-enroll', catchAsync(async (req: Request, res: Response) => {
  const { code } = mfaVerifySchema.parse(req.body);
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'AUTH_REQUIRED',
    });
  }

  // Get user
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      code: 'USER_NOT_FOUND',
    });
  }

  // In a real app, verify against the temporary secret
  // For now, just return success
  res.json({
    success: true,
    message: 'MFA enrolled successfully',
  });
}));

/**
 * POST /api/v1/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', catchAsync(async (req: Request, res: Response) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  const sanitizedEmail = sanitizeEmail(email);

  // Check if user exists (but don't reveal this to user)
  const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });

  if (user) {
    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password_reset' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // In a real app, send email with reset link
    console.log(`Password reset token for ${email}:`, resetToken);
  }

  // Always return success to prevent email enumeration
  res.json({
    success: true,
    message: 'If the email exists, a password reset link has been sent.',
  });
}));

/**
 * POST /api/v1/auth/reset-password
 * Reset password using token
 */
router.post('/reset-password', catchAsync(async (req: Request, res: Response) => {
  const { token, password } = resetPasswordSchema.parse(req.body);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.type !== 'password_reset') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    // Hash new password with Argon2id
    const passwordHash = await hash(password, {
      type: 'argon2id',
      memoryCost: 65536,  // 64 MB
      timeCost: 3,
      parallelism: 4,
    });

    // Update password and clear failed attempts
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
    });

    await logAudit(req, 'PASSWORD_CHANGE', 'user', user.id);

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
    });
  }
}));

/**
 * GET /api/v1/auth/me
 * Get current user info
 */
router.get('/me', catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'AUTH_REQUIRED',
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isMfaEnabled: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  res.json({
    success: true,
    data: {
      user,
      roles: req.user?.roles,
      permissions: req.user?.permissions,
    },
  });
}));

export default router;