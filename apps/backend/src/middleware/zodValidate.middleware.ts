import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendValidationError } from '../utils/response';

/**
 * Zod middleware factory.
 * Validates req.body against the provided Zod schema.
 * Returns 422 with field-level error messages on failure.
 *
 * @example
 *   router.post('/register', validateBody(registerSchema), authController.register)
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      sendValidationError(res, errors);
      return;
    }
    // Replace req.body with the parsed & coerced output (e.g. lowercased email)
    req.body = result.data as Record<string, unknown>;
    next();
  };
}

/**
 * Validates req.query against a Zod schema.
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      sendValidationError(res, errors);
      return;
    }
    req.query = result.data as Record<string, string>;
    next();
  };
}

/**
 * Validates req.params against a Zod schema.
 */
export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      sendValidationError(res, errors);
      return;
    }
    req.params = result.data as Record<string, string>;
    next();
  };
}

// ─── Format Zod errors into a flat, API-friendly shape ──────────────────────
function formatZodErrors(error: ZodError): { field: string; message: string }[] {
  return error.errors.map((e) => ({
    field: e.path.join('.') || 'body',
    message: e.message,
  }));
}
