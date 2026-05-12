/**
 * Input sanitization utilities for RakshaAI backend.
 * Guards against XSS, SQL injection patterns, and null-byte injection.
 */

/** Characters / patterns that should never appear in plain text fields */
const SCRIPT_TAG_RE = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const HTML_TAG_RE = /<[^>]+>/g;
const NULL_BYTE_RE = /\0/g;
const SQL_INJECTION_RE = /(['";]|--|\bDROP\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b|\bSELECT\b|\bEXEC\b|\bUNION\b)/gi;

/**
 * Strip dangerous HTML / script tags from a string value.
 * Use for user-supplied freetext (descriptions, titles, etc.)
 */
export function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(NULL_BYTE_RE, '')
    .replace(SCRIPT_TAG_RE, '')
    .replace(HTML_TAG_RE, '')
    .trim();
}

/**
 * Detect if a string contains SQL injection patterns.
 * Returns true if the value looks dangerous.
 */
export function containsSqlInjection(value: string): boolean {
  return SQL_INJECTION_RE.test(value);
}

/**
 * Sanitize an object's string values recursively.
 * Mutates the object in place and returns it.
 * Max depth: 5 to prevent prototype pollution via deep nesting.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T, depth = 0): T {
  if (depth > 5 || typeof obj !== 'object' || obj === null) return obj;

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === 'string') {
      (obj as Record<string, unknown>)[key] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitizeObject(value as Record<string, unknown>, depth + 1);
    } else if (Array.isArray(value)) {
      (obj as Record<string, unknown>)[key] = value.map((item) =>
        typeof item === 'string' ? sanitizeText(item) : item
      );
    }
  }

  return obj;
}

/**
 * Express middleware: sanitize all string fields in req.body.
 * Apply globally or per-route for user-submitted content.
 */
import type { Request, Response, NextFunction } from 'express';

export function sanitizeBody(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body as Record<string, unknown>);
  }
  next();
}
