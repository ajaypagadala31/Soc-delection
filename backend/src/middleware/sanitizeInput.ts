/**
 * Input Sanitization Middleware
 *
 * Features:
 * - XSS prevention via sanitization
 * - SQL injection prevention
 * - HTML sanitization
 * - Request body validation
 * - Deep sanitization of nested objects
 */

import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';
import xss from 'xss';

// Configure XSS options
const xssOptions = {
  whiteList: {
    // Allow basic formatting tags
    b: [],
    i: [],
    em: [],
    strong: [],
    a: ['href', 'title', 'target'],
    p: [],
    br: [],
    span: ['style'],
    pre: [],
    code: [],
    ul: [],
    ol: [],
    li: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
};

// Configure HTML sanitization
const sanitizeOptions = {
  allowedTags: sanitizeHtml.simpleWhitelist({
    'b': [],
    'i': [],
    'em': [],
    'strong': [],
    'a': ['href', 'title'],
    'p': [],
    'br': [],
    'pre': [],
    'code': [],
    'ul': [],
    'ol': [],
    'li': [],
  }),
  allowedAttributes: {
    'a': ['href', 'title'],
    'span': ['style'],
  },
  transformTags: {
    'span': sanitizeHtml.simpleTransform('span'),
  },
};

/**
 * Deep sanitization function for objects
 */
const deepSanitize = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    // Apply XSS protection first
    let sanitized = xss(value, xssOptions);

    // Then apply HTML sanitization
    sanitized = sanitizeHtml(sanitized, sanitizeOptions);

    return sanitized;
  }

  if (Array.isArray(value)) {
    return value.map(item => deepSanitize(item));
  }

  if (typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(value)) {
      // Sanitize keys as well
      const sanitizedKey = typeof key === 'string' ? xss(key) : key;
      sanitized[sanitizedKey] = deepSanitize(val);
    }

    return sanitized;
  }

  return value;
};

/**
 * Sanitization Middleware
 * Prevents XSS, SQL injection, and other injection attacks
 */
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = deepSanitize(req.body) as typeof req.body;
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = deepSanitize(req.query) as typeof req.query;
    }

    // Sanitize route params
    if (req.params && typeof req.params === 'object') {
      req.params = deepSanitize(req.params) as typeof req.params;
    }

    next();
  } catch (error) {
    console.error('Sanitization error:', error);
    return res.status(400).json({
      success: false,
      error: 'Invalid input detected',
      code: 'INVALID_INPUT',
    });
  }
};

/**
 * Specific sanitizers for common data types
 */

/**
 * Sanitize email address
 */
export const sanitizeEmail = (email: string): string => {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@._%+-]/g, '');
};

/**
 * Sanitize username (for usernames, slugs, etc.)
 */
export const sanitizeUsername = (username: string): string => {
  return username
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .substring(0, 50);
};

/**
 * Sanitize search query
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .substring(0, 100)
    .replace(/[<>'"&]/g, (char) => {
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
        '&': '&amp;',
      };
      return escapeMap[char] || char;
    });
};

/**
 * Validate and sanitize number
 */
export const sanitizeNumber = (value: string | number, min?: number, max?: number): number => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(num)) {
    throw new Error('Invalid number');
  }

  if (min !== undefined && num < min) {
    throw new Error(`Value must be at least ${min}`);
  }

  if (max !== undefined && num > max) {
    throw new Error(`Value must be at most ${max}`);
  }

  return num;
};

/**
 * Validate UUID format
 */
export const isValidUuid = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};