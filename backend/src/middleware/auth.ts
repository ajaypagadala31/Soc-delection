/**
 * Authentication and Authorization Middleware
 *
 * Features:
 * - JWT token validation
 * - Token refresh support
 * - Role-based access control
 * - Permission verification
 * - Session management
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// JWT token types
interface JwtPayload {
  userId: string;
  type: 'access' | 'refresh';
  sessionId?: string;
  mfaVerified?: boolean;
  iat: number;
  exp: number;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        roles: string[];
        permissions: string[];
        isActive: boolean;
        isMfaEnabled: boolean;
        mfaVerified: boolean;
      };
      authenticated: boolean;
    }
  }
}

/**
 * Main Authentication Middleware
 * Validates JWT access token and loads user with roles and permissions
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
        code: 'TOKEN_MISSING',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      if (decoded.type !== 'access') {
        return res.status(401).json({
          success: false,
          error: 'Invalid token type',
          code: 'INVALID_TOKEN_TYPE',
        });
      }

      // Check if token is expired (shouldn't happen with verify, but double-check)
      if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({
          success: false,
          error: 'Token expired',
          code: 'TOKEN_EXPIRED',
          requiresRefresh: true,
        });
      }

      // Fetch user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          error: 'Account deactivated',
          code: 'ACCOUNT_DEACTIVATED',
        });
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        return res.status(423).json({
          success: false,
          error: 'Account temporarily locked due to too many failed login attempts',
          code: 'ACCOUNT_LOCKED',
        });
      }

      // Extract roles and permissions
      const roles = user.roles.map(ur => ur.role.name);
      const permissions = [...new Set(user.roles.flatMap(ur =>
        ur.role.permissions.map(p => `${p.resource}:${p.action}`)
      ))];

      // Attach user info to request
      req.user = {
        id: user.id,
        email: user.email,
        roles,
        permissions,
        isActive: user.isActive,
        isMfaEnabled: user.isMfaEnabled,
        mfaVerified: decoded.mfaVerified || false,
      };
      req.authenticated = true;

      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          error: 'Token expired',
          code: 'TOKEN_EXPIRED',
          requiresRefresh: true,
        });
      }

      if (jwtError instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token',
          code: 'INVALID_TOKEN',
        });
      }

      throw jwtError;
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_ERROR',
    });
  }
};

/**
 * Role-Based Access Control Middleware
 * Checks if user has required roles
 */
export const requireRoles = (...requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
    }

    const hasRole = requiredRoles.some(role => req.user!.roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: requiredRoles,
      });
    }

    next();
  };
};

/**
 * Permission-Based Access Control Middleware
 * Checks if user has required permissions
 */
export const requirePermissions = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
    }

    const hasPermission = requiredPermissions.every(permission =>
      req.user!.permissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: requiredPermissions,
      });
    }

    next();
  };
};

/**
 * Resource Ownership Authorization
 * Verifies user owns the resource they're accessing
 */
export const authorizeResourceOwner = (
  resourceType: string,
  resourceIdParam: string = 'id'
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
    }

    const resourceId = req.params[resourceIdParam];
    const userId = req.user.id;

    // Super Admin can access any resource
    if (req.user.roles.includes('superadmin')) {
      return next();
    }

    // Check if user is the owner or has admin role
    const isAdmin = req.user.roles.some(r =>
      ['admin', 'manager', 'socmanager'].includes(r)
    );

    if (isAdmin) {
      return next();
    }

    // Check ownership based on resource type
    let isOwner = false;

    switch (resourceType) {
      case 'incident':
        const incident = await prisma.incident.findUnique({
          where: { id: resourceId },
          select: { createdBy: true, assignedTo: true },
        });
        isOwner = incident && (
          incident.createdBy === userId || incident.assignedTo === userId
        );
        break;

      case 'alert':
        const alert = await prisma.alert.findUnique({
          where: { id: resourceId },
          select: { assignedTo: true },
        });
        isOwner = alert && alert.assignedTo === userId;
        break;

      case 'user':
        isOwner = resourceId === userId;
        break;

      default:
        // If we can't verify ownership, deny access
        return res.status(404).json({
          success: false,
          error: 'Resource not found',
          code: 'NOT_FOUND',
        });
    }

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this resource',
        code: 'RESOURCE_ACCESS_DENIED',
      });
    }

    next();
  };
};

/**
 * Optional Authentication Middleware
 * Allows route to work with or without authentication
 * Useful for public endpoints that show personalized info when logged in
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.authenticated = false;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (decoded.type !== 'access') {
      req.authenticated = false;
      return next();
    }

    // Just check if token is valid, don't load full user
    req.authenticated = true;
    next();
  } catch (error) {
    req.authenticated = false;
    next();
  }
};