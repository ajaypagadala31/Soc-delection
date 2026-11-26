/**
 * WebSocket Server Service
 *
 * Features:
 * - Real-time alert streaming
 * - JWT-based authentication for WebSocket connections
 * - Channel-based messaging
 * - Room-based subscriptions
 * - Redis adapter for scaling
 */

import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// User role levels for WebSocket access
const ROLE_LEVELS: Record<string, number> = {
  viewer: 1,
  analyst: 2,
  manager: 3,
  superadmin: 4,
};

// Room names
export const ROOMS = {
  ALERTS: 'alerts',
  INCIDENTS: 'incidents',
  ALL: 'all',
  USERS: 'users',
} as const;

// WebSocket event types
export const EVENTS = {
  ALERT_CREATED: 'alert.created',
  ALERT_UPDATED: 'alert.updated',
  ALERT_ACKNOWLEDGED: 'alert.acknowledged',
  INCIDENT_CREATED: 'incident.created',
  INCIDENT_UPDATED: 'incident.updated',
  INCIDENT_ASSIGNED: 'incident.assigned',
  USER_CONNECTED: 'user.connected',
  USER_DISCONNECTED: 'user.disconnected',
  SYSTEM_HEALTH: 'system.health',
} as const;

// JWT payload for WebSocket connections
interface WsJwtPayload {
  userId: string;
  type: 'access';
  mfaVerified: boolean;
  iat: number;
  exp: number;
}

// Socket extension
declare global {
  namespace NodeJS {
    interface Socket {
      userId?: string;
      userRoles?: string[];
      userPermissions?: string[];
    }
  }
}

/**
 * Initialize WebSocket server
 */
export const initWebSocket = (io: SocketIOServer) => {
  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as WsJwtPayload;

      if (decoded.type !== 'access') {
        return next(new Error('Invalid token type'));
      }

      // Attach user info to socket
      (socket as any).userId = decoded.userId;

      next();
    } catch (error) {
      return next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', async (socket: Socket) => {
    const userId = (socket as any).userId as string;

    console.log(`User ${userId} connected via WebSocket`);

    // Load user with roles
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      socket.disconnect(true);
      return;
    }

    // Store user roles on socket
    const roles = user.roles.map(ur => ur.role.name);
    (socket as any).userRoles = roles;

    // Store session in database
    await prisma.websocketSession.create({
      data: {
        userId,
        sessionId: socket.id,
        socketId: socket.id,
        ipAddress: socket.handshake.address,
        connectedAt: new Date(),
      },
    });

    // Join user-specific room
    socket.join(`user:${userId}`);

    // Join role-based rooms
    const userRoleLevel = Math.max(
      ...roles.map(r => ROLE_LEVELS[r.toLowerCase()] || 0)
    );

    if (userRoleLevel >= 1) socket.join(ROOMS.ALERTS);
    if (userRoleLevel >= 2) socket.join(ROOMS.INCIDENTS);
    if (userRoleLevel >= 3) socket.join(ROOMS.USERS);
    socket.join(ROOMS.ALL);

    // Emit user connected event
    socket.to(ROOMS.ALL).emit(EVENTS.USER_CONNECTED, {
      userId,
      email: user.email,
      roles,
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User ${userId} disconnected from WebSocket`);

      // Update session in database
      await prisma.websocketSession.updateMany({
        where: { socketId: socket.id },
        data: {
          disconnectedAt: new Date(),
        },
      });

      // Emit user disconnected event
      socket.to(ROOMS.ALL).emit(EVENTS.USER_DISCONNECTED, { userId });
    });

    // Handle ping/pong
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Handle subscription requests
    socket.on('subscribe', (room: string) => {
      socket.join(room);
      socket.emit('subscribed', room);
    });

    socket.on('unsubscribe', (room: string) => {
      socket.leave(room);
      socket.emit('unsubscribed', room);
    });
  });
};

/**
 * WebSocket event emitters
 */
export const emitAlertCreated = (io: SocketIOServer, alert: any) => {
  io.emit(EVENTS.ALERT_CREATED, alert);
};

export const emitAlertUpdated = (io: SocketIOServer, alert: any) => {
  io.emit(EVENTS.ALERT_UPDATED, alert);
};

export const emitAlertAcknowledged = (io: SocketIOServer, alertId: string, userId: string) => {
  io.emit(EVENTS.ALERT_ACKNOWLEDGED, { alertId, acknowledgedBy: userId });
};

export const emitIncidentCreated = (io: SocketIOServer, incident: any) => {
  io.emit(EVENTS.INCIDENT_CREATED, incident);
};

export const emitIncidentUpdated = (io: SocketIOServer, incident: any) => {
  io.emit(EVENTS.INCIDENT_UPDATED, incident);
};

export const emitIncidentAssigned = (io: SocketIOServer, incidentId: string, assignedTo: string) => {
  io.emit(EVENTS.INCIDENT_ASSIGNED, { incidentId, assignedTo });
};

/**
 * Broadcast system health status
 */
export const emitSystemHealth = (io: SocketIOServer, health: any) => {
  io.to(ROOMS.ALL).emit(EVENTS.SYSTEM_HEALTH, health);
};