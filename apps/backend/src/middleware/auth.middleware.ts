import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { env } from '../config/env';
import { sendUnauthorized, sendForbidden } from '../utils/response';

interface JwtPayload {
  sub: string;        // user id
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/** Verifies the Bearer JWT and populates req.user. */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    sendUnauthorized(res, 'No token provided');
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    sendUnauthorized(res, 'Invalid or expired token');
  }
}

/**
 * Factory — restricts access to specified roles.
 * Must be used AFTER authenticate().
 *
 * @example router.get('/admin', authenticate, authorize('admin'), handler)
 */
export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res);
      return;
    }
    if (!roles.includes(req.user.role)) {
      sendForbidden(res, 'You do not have permission to access this resource');
      return;
    }
    next();
  };
}
