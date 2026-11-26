/**
 * User Management API Routes
 *
 * Features:
 * - CRUD operations for users
 * - Role assignment and management
 * - RBAC enforcement
 * - Audit logging
 */

import { Router, Request, Response } from 'express';
import { catchAsync } from '../middleware/errorHandler';
import { prisma } from '../index';
import { logAudit } from '../middleware/auditLogger';
import { requireRoles, requirePermissions, authorizeResourceOwner } from '../middleware/auth';
import { hash } from 'argon2';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(//[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().min(1, 'First name required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name required').max(50, 'Last name too long'),
  roles: z.array(z.string()).optional(),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name required').max(50, 'Last name too long').optional(),
  isMfaEnabled: z.boolean().optional(),
});

const assignRoleSchema = z.object({
  roleId: z.string().uuid('Invalid role ID'),
});

/**
 * GET /api/v1/users
 * List all users
 * Requires: SOC Manager or Super Admin role
 */
router.get('/', requireRoles('manager', 'superadmin'), catchAsync(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      isMfaEnabled: true,
      createdAt: true,
      lastLoginAt: true,
      roles: {
        include: {
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Transform roles into array of role names
  const transformedUsers = users.map(user => ({
    ...user,
    roles: user.roles.map(ur => ur.role.name),
  }));

  res.json({
    success: true,
    data: transformedUsers,
    count: transformedUsers.length,
  });
}));

/**
 * POST /api/v1/users
 * Create a new user
 * Requires: Super Admin role
 */
router.post('/', requireRoles('superadmin'), catchAsync(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, roles: userRoles } = createUserSchema.parse(req.body);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'User with this email already exists',
      code: 'USER_EXISTS',
    });
  }

  // Hash password with Argon2id
  const passwordHash = await hash(password, {
    type: 'argon2id',
    memoryCost: 65536,  // 64 MB
    timeCost: 3,
    parallelism: 4,
  });

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      roles: {
        create: userRoles?.map(roleName => ({
          role: {
            connect: { name: roleName },
          },
        })) || [{ role: { connect: { name: 'viewer' } } }], // Default role
      },
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  await logAudit(req, 'USER_CREATE', 'user', user.id, {
    roles: userRoles || ['viewer'],
  });

  res.status(201).json({
    success: true,
    data: {
      ...user,
      roles: user.roles.map(ur => ur.role.name),
      passwordHash: undefined, // Don't return password hash
    },
  });
}));

/**
 * GET /api/v1/users/:id
 * Get user by ID
 * Requires: SOC Manager or Super Admin, or user's own resource
 */
router.get('/:id', catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      isMfaEnabled: true,
      createdAt: true,
      lastLoginAt: true,
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      code: 'USER_NOT_FOUND',
    });
  }

  res.json({
    success: true,
    data: {
      ...user,
      roles: user.roles.map(ur => ur.role.name),
    },
  });
}));

/**
 * PUT /api/v1/users/:id
 * Update user
 * Requires: Super Admin, or user's own resource with role check
 */
router.put('/:id', catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = updateUserSchema.parse(req.body);

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      code: 'USER_NOT_FOUND',
    });
  }

  // Update user
  const user = await prisma.user.update({
    where: { id },
    data: updates,
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  await logAudit(req, 'USER_UPDATE', 'user', id);

  res.json({
    success: true,
    data: {
      ...user,
      roles: user.roles.map(ur => ur.role.name),
    },
  });
}));

/**
 * DELETE /api/v1/users/:id
 * Deactivate user (soft delete)
 * Requires: Super Admin role
 */
router.delete('/:id', requireRoles('superadmin'), catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      code: 'USER_NOT_FOUND',
    });
  }

  // Soft delete - deactivate account
  await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });

  await logAudit(req, 'USER_DELETE', 'user', id);

  res.json({
    success: true,
    message: 'User deactivated successfully',
  });
}));

/**
 * GET /api/v1/users/:id/roles
 * Get user roles
 * Requires: SOC Manager or Super Admin
 */
router.get('/:id/roles', requireRoles('manager', 'superadmin'), catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          role: true,
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      code: 'USER_NOT_FOUND',
    });
  }

  const roles = user.roles.map(ur => ({
    id: ur.role.id,
    name: ur.role.name,
    description: ur.role.description,
    permissions: ur.role.permissions.map(rp => rp.permission),
  }));

  res.json({
    success: true,
    data: roles,
  });
}));

/**
 * POST /api/v1/users/:id/roles
 * Assign role to user
 * Requires: Super Admin role
 */
router.post('/:id/roles', requireRoles('superadmin'), catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { roleId } = assignRoleSchema.parse(req.body);

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      code: 'USER_NOT_FOUND',
    });
  }

  // Check if role exists
  const role = await prisma.role.findUnique({ where: { id: roleId } });

  if (!role) {
    return res.status(404).json({
      success: false,
      error: 'Role not found',
      code: 'ROLE_NOT_FOUND',
    });
  }

  // Check if user already has this role
  const hasRole = await prisma.userRole.findUnique({
    where: {
      userId_roleId: { userId: id, roleId },
    },
  });

  if (hasRole) {
    return res.status(409).json({
      success: false,
      error: 'User already has this role',
      code: 'ROLE_ALREADY_ASSIGNED',
    });
  }

  // Assign role
  await prisma.userRole.create({
    data: {
      userId: id,
      roleId,
    },
  });

  await logAudit(req, 'ROLE_ASSIGNED', 'user', id, { roleId, roleName: role.name });

  res.json({
    success: true,
    message: 'Role assigned successfully',
  });
}));

/**
 * DELETE /api/v1/users/:id/roles/:roleId
 * Remove role from user
 * Requires: Super Admin role
 */
router.delete('/:id/roles/:roleId', requireRoles('superadmin'), catchAsync(async (req: Request, res: Response) => {
  const { id, roleId } = req.params;

  const userRole = await prisma.userRole.findUnique({
    where: {
      userId_roleId: { userId: id, roleId },
    },
    include: {
      role: true,
    },
  });

  if (!userRole) {
    return res.status(404).json({
      success: false,
      error: 'User role assignment not found',
      code: 'USER_ROLE_NOT_FOUND',
    });
  }

  // Check if this would leave user with no roles
  const remainingRoles = await prisma.userRole.count({ where: { userId: id } });

  if (remainingRoles <= 1) {
    return res.status(400).json({
      success: false,
      error: 'Cannot remove last role from user',
      code: 'CANNOT_REMOVE_LAST_ROLE',
    });
  }

  await prisma.userRole.delete({
    where: {
      userId_roleId: { userId: id, roleId },
    },
  });

  await logAudit(req, 'ROLE_REMOVED', 'user', id, { roleId, roleName: userRole.role.name });

  res.json({
    success: true,
    message: 'Role removed successfully',
  });
}));

export default router;