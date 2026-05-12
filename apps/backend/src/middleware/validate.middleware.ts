import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendValidationError } from '../utils/response';

/**
 * Reads express-validator result and returns 422 if any errors exist.
 * Place this after all check() calls in a route handler chain.
 */
export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendValidationError(res, errors.array());
    return;
  }
  next();
}
