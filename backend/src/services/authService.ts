import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/errors';
import { RegisterInput, LoginInput } from '../utils/validation';

const prisma = new PrismaClient();

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role || 'CUSTOMER',
        specialty: input.specialty || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        specialty: true,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role as 'CUSTOMER' | 'BARBER',
    });

    return { user, token };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const passwordValid = await verifyPassword(input.password, user.password);

    if (!passwordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role as 'CUSTOMER' | 'BARBER',
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialty: user.specialty,
      },
      token,
    };
  }
}
