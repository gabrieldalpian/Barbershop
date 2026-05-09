import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { registerSchema, loginSchema } from '../utils/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const authController = new AuthController();

router.post(
  '/register',
  validateRequest(registerSchema),
  asyncHandler((req, res) => authController.register(req, res))
);

router.post(
  '/login',
  validateRequest(loginSchema),
  asyncHandler((req, res) => authController.login(req, res))
);

export default router;
