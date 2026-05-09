import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AppError } from '../utils/errors';
import { RegisterInput, LoginInput } from '../utils/validation';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const input = req.body as RegisterInput;
      const result = await authService.register(input);

      res.status(201).json({
        message: 'User registered successfully',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const input = req.body as LoginInput;
      const result = await authService.login(input);

      res.status(200).json({
        message: 'Login successful',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Login failed' });
      }
    }
  }
}
