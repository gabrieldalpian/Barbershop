import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'development_secret';

export interface JWTPayload {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'BARBER';
}

export const generateToken = (payload: JWTPayload, expiresIn: string | number = '24h'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
};
