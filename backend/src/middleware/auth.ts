import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken, JWTPayload } from '../utils/jwt';
import { AppError } from '../utils/errors';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new AppError(401, 'No authentication token provided');
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};
