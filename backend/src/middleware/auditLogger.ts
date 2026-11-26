/**
 * Audit Logging Middleware
 *
 * Features:
 * - Records all user actions for compliance
 * - Append-only log storage
 * - IP and user agent tracking
 * - Structured JSON logging
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Audit action types
type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'MFA_ENROLL'
  | 'MFA_VERIFY'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'ROLE_ASSIGNED'
  | 'ROLE_REMOVED'
  | 'RULE_CREATE'
  | 'RULE_UPDATE'
  | 'RULE_DETECT'
  | 'ALERT_CREATE'
  | 'ALERT_UPDATE'
  | 'ALERT_ACKNOWLEDGE'
  | 'ALERT_CLOSE'
  | 'INCIDENT_CREATE'
  | 'INCIDENT_UPDATE'
  | 'INCIDENT_ASSIGN'
  | 'INCIDENT_RESOLVE'
  | 'CONFIG_CHANGE'
  | 'API_KEY_CREATE'
  | 'API_KEY_DELETE'
  | 'LOGOUT'
  | 'UNKNOWN';

interface AuditLog {
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}

/**
 * Audit Logger Middleware
 * Automatically logs all requests to the audit log
 */
export const auditLogger = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  // Only log authenticated requests
  const isAuthRequest = req.path.startsWith('/api/v1/auth');
  const userId = req.user?.id;

  // Capture response for logging
  const originalSend = res.send;
  res.send = function(body: unknown) {
    (res as unknown as { _responseBody: unknown })._responseBody = body;
    return originalSend.call(this, body);
  };

  // Log after response is sent
  res.on('finish', async () => {
    // Skip logging for health checks
    if (req.path === '/health' || req.path === '/metrics') {
      return;
    }

    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Determine audit action based on HTTP method and path
    let action: AuditAction = 'UNKNOWN';
    const resourceType = extractResourceType(req);
    const resourceId = extractResourceId(req);

    switch (req.method) {
      case 'POST':
        if (req.path.includes('/auth/login')) {
          action = req.body?.success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE';
        } else {
          action = extractCreateAction(req.path);
        }
        break;
      case 'PUT':
      case 'PATCH':
        action = extractUpdateAction(req.path);
        break;
      case 'DELETE':
        action = extractDeleteAction(req.path);
        break;
      case 'GET':
        // GET requests typically don't modify data
        break;
    }

    // Only log if there was a state-changing action
    if (action !== 'UNKNOWN' && !isAuthRequest) {
      try {
        await prisma.auditLog.create({
          data: {
            userId,
            action,
            resourceType,
            resourceId,
            ipAddress: req.ip || req.socket.remoteAddress,
            userAgent: req.get('User-Agent'),
            details: {
              method: req.method,
              path: req.path,
              statusCode,
              responseTime,
              body: req.body,
              query: req.query,
              params: req.params,
            },
          },
        });
      } catch (error) {
        console.error('Failed to write audit log:', error);
      }
    }

    next();
  });

  next();
};

/**
 * Dedicated audit logger for specific actions
 */
export const logAudit = async (
  req: Request,
  action: AuditAction,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, unknown>
): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action,
        resourceType,
        resourceId,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.get('User-Agent'),
        details,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

/**
 * Extract resource type from request path
 */
function extractResourceType(req: Request): string {
  const path = req.path;

  // Map paths to resource types
  if (path.includes('/users')) return 'user';
  if (path.includes('/alerts')) return 'alert';
  if (path.includes('/incidents')) return 'incident';
  if (path.includes('/rules')) return 'detection_rule';
  if (path.includes('/wazuh')) return 'wazuh_integration';
  if (path.includes('/iocs')) return 'indicator_of_compromise';
  if (path.includes('/intel')) return 'threat_intelligence';

  return 'unknown';
}

/**
 * Extract resource ID from request
 */
function extractResourceId(req: Request): string | undefined {
  return req.params.id || req.body.id;
}

/**
 * Map request paths to audit actions
 */
function extractCreateAction(path: string): AuditAction {
  if (path.includes('/users')) return 'USER_CREATE';
  if (path.includes('/incidents')) return 'INCIDENT_CREATE';
  if (path.includes('/alerts')) return 'ALERT_CREATE';
  if (path.includes('/rules')) return 'RULE_CREATE';
  if (path.includes('/api-keys')) return 'API_KEY_CREATE';
  return 'UNKNOWN';
}

function extractUpdateAction(path: string): AuditAction {
  if (path.includes('/users')) return 'USER_UPDATE';
  if (path.includes('/incidents')) return 'INCIDENT_UPDATE';
  if (path.includes('/alerts')) return 'ALERT_UPDATE';
  if (path.includes('/rules')) return 'RULE_UPDATE';
  if (path.includes('/api-keys')) return 'API_KEY_CREATE'; // API keys are created on update
  return 'UNKNOWN';
}

function extractDeleteAction(path: string): AuditAction {
  if (path.includes('/users')) return 'USER_DELETE';
  if (path.includes('/incidents')) return 'INCIDENT_UPDATE'; // Archive instead of delete
  if (path.includes('/alerts')) return 'ALERT_UPDATE'; // Close instead of delete
  if (path.includes('/rules')) return 'RULE_UPDATE'; // Deactivate instead of delete
  if (path.includes('/api-keys')) return 'API_KEY_DELETE';
  return 'UNKNOWN';
}