import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user injected by auth middleware */
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export {};
