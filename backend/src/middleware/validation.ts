import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/errors';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      const message = error.errors?.[0]?.message || 'Validation failed';
      res.status(400).json({ error: message });
    }
  };
};
