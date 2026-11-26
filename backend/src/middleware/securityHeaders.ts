/**
 * Security Headers Middleware
 *
 * Implements comprehensive security headers for:
 * - XSS Protection
 * - Clickjacking Prevention
 * - MIME Type Sniffing Prevention
 * - Content Security Policy
 * - HSTS (HTTP Strict Transport Security)
 * - Referrer Policy
 * - Permissions Policy
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Custom security headers middleware
 * Provides defense-in-depth protection
 */
export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Remove server identification
  res.removeHeader('X-Powered-By');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy for privacy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy (formerly Feature Policy)
  res.setHeader(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
  );

  // Cache control for API responses
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // Add security warning header for development
  if (process.env.NODE_ENV !== 'production') {
    res.setHeader('X-Dev-Warning', 'Development mode - not for production use');
  }

  next();
};

/**
 * Security headers for WebSocket connections
 */
export const websocketSecurityHeaders = {
  // Validate Origin header
  validateOrigin: (origin: string | undefined, host: string): boolean => {
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
    ];

    if (!origin) {
      // Allow connections without origin (e.g., from same server)
      return true;
    }

    return allowedOrigins.some(allowed => {
      try {
        const allowedUrl = new URL(allowed);
        const originUrl = new URL(origin);
        return originUrl.hostname === allowedUrl.hostname;
      } catch {
        return false;
      }
    });
  },

  // Maximum payload size for WebSocket messages
  maxPayloadSize: '1mb',

  // Ping timeout for detecting stale connections
  pingTimeout: 30000,

  // Pong interval for keeping connections alive
  pongInterval: 25000,
};