import { Request, Response, NextFunction } from 'express';
import { AppError, handleError } from '../utils/errors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
};

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
