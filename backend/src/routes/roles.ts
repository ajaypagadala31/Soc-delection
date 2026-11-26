/**
 * Role and Permission Management API Routes
 *
 * Features:
 * - CRUD operations for roles
 * - Permission management
 * - RBAC configuration
 * - Audit logging
 */

import { Router, Request, Response } from 'express';
import { catchAsync } from '../middleware/errorHandler';
import { prisma } from '../index';
import { logAudit } from '../middleware/auditLogger';
import { requireRoles } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name required').max(50, 'Role name too long'),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

const updateRoleSchema = z.object({
  name: z.string().min(1, 'Role name required').max(50, 'Role name too long').optional(),
  description: z.string().optional(),
});

const assignPermissionSchema = z.object({
  permissionId: z.string().uuid('Invalid permission ID'),
});

/**
 * GET /api/v1/roles
 * List all roles with their permissions
 * Requires: SOC Manager or Super Admin role
 */
router.get('/', requireRoles('manager', 'superadmin'), catchAsync(async (req: Request, res: Response) => {
  const roles = await prisma.role.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
      _count: {
        select: { users: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  const rolesWithCount = roles.map(role => ({
    id: role.id,
    name: role.name,
    description: role.description,
    userCount: role._count.users,
    permissions: role.permissions.map(rp => rp.permission),
  }));

  res.json({
    success: true,
    data: rolesWithCount,
  });
}));

/**
 * POST /api/v1/roles
 * Create a new role
 * Requires: Super Admin role
 */
router.post('/', requireRoles('superadmin'), catchAsync(async (req: Request, res: Response) => {
  const { name, description, permissions } = createRoleSchema.parse(req.body);

  // Check if role already exists
  const existingRole = await prisma.role.findUnique({ where: { name } });

  if (existingRole) {
    return res.status(409).json({
      success: false,
      error: 'Role with this name already exists',
      code: 'ROLE_EXISTS',
    });
  }

  // Create role
  const role = await prisma.role.create({
    data: {
      name,
      description,
      permissions: permissions
        ? {
            create: permissions.map(permissionId => ({
              permission: {
                connect: { id: permissionId },
              },
            })),
          }
        : undefined,
    },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  await logAudit(req, 'ROLE_CREATED', 'role', role.id, { name, permissions });

  res.status(201).json({
    success: true,
    data: {
      ...role,
      permissions: role.permissions.map(rp => rp.permission),
    },
  });
}));

/**
 * GET /api/v1/roles/:id
 * Get role by ID
 * Requires: SOC Manager or Super Admin role
 */
router.get('/:id', requireRoles('manager', 'superadmin'), catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
      users: {
        select: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!role) {
    return res.status(404).json({
      success: false,
      error: 'Role not found',
      code: 'ROLE_NOT_FOUND',
    });
  }

  res.json({
    success: true,
    data: {
      id: role.id,
      name: role.name,
      description: role.description,
      users: role.users.map(ur => ur.user),
      permissions: role.permissions.map(rp => rp.permission),
    },
  });
}));

/**
 * PUT /api/v1/roles/:id
 * Update role
 * Requires: Super Admin role
 */
router.put('/:id', requireRoles('superadmin'), catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = updateRoleSchema.parse(req.body);

  const role = await prisma.role.update({
    where: { id },
    data: updates,
  });

  await logAudit(req, 'ROLE_UPDATE', 'role', id, updates);

  res.json({
    success: true,
    data: role,
  });
}));

/**
 * DELETE /api/v1/roles/:id
 * Delete role (only if no users assigned)
 * Requires: Super Admin role
 */
router.delete('/:id', requireRoles('superadmin'), catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if role exists
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      _count: {
        select: { users: true },
      },
    },
  });

  if (!role) {
    return res.status(404).json({
      success: false,
      error: 'Role not found',
      code: 'ROLE_NOT_FOUND',
    });
  }

  // Check if any users have this role
  if (role._count.users > 0) {
    return res.status(400).json({
      success: false,
      error: 'Cannot delete role with assigned users. Remove users first.',
      code: 'ROLE_HAS_USERS',
    });
  }

  await prisma.role.delete({ where: { id } });

  await logAudit(req, 'ROLE_DELETE', 'role', id, { name: role.name });

  res.json({
    success: true,
    message: 'Role deleted successfully',
  });
}));

/**
 * GET /api/v1/permissions
 * List all permissions
 * Requires: SOC Manager or Super Admin role
 */
router.get('/permissions', requireRoles('manager', 'superadmin'), catchAsync(async (_req: Request, res: Response) => {
  const permissions = await prisma.permission.findMany({
    orderBy: { resource: 'asc' },
  });

  res.json({
    success: true,
    data: permissions,
  });
}));

/**
 * POST /api/v1/roles/:id/permissions
 * Assign permissions to role
 * Requires: Super Admin role
 */
router.post('/:id/permissions', requireRoles('superadmin'), catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { permissions } = req.body;

  // Check if role exists
  const role = await prisma.role.findUnique({ where: { id } });

  if (!role) {
    return res.status(404).json({
      success: false,
      error: 'Role not found',
      code: 'ROLE_NOT_FOUND',
    });
  }

  // Add permissions in batch
  await prisma.rolePermission.createMany({
    data: permissions.map((permissionId: string) => ({
      roleId: id,
      permissionId,
    })),
    skipDuplicates: true,
  });

  await logAudit(req, 'ROLE_PERMISSIONS_UPDATED', 'role', id, { permissionCount: permissions.length });

  res.json({
    success: true,
    message: 'Permissions updated successfully',
  });
}));

/**
 * DELETE /api/v1/roles/:id/permissions/:permissionId
 * Remove permission from role
 * Requires: Super Admin role
 */
router.delete('/:id/permissions/:permissionId', requireRoles('superadmin'), catchAsync(async (req: Request, res: Response) => {
  const { id, permissionId } = req.params;

  await prisma.rolePermission.delete({
    where: {
      roleId_permissionId: { roleId: id, permissionId },
    },
  });

  await logAudit(req, 'ROLE_PERMISSION_REMOVED', 'role', id, { permissionId });

  res.json({
    success: true,
    message: 'Permission removed successfully',
  });
}));

export default router;