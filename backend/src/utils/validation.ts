import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CUSTOMER', 'BARBER']).optional().default('CUSTOMER'),
  specialty: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const appointmentSchema = z.object({
  date: z.string().datetime('Invalid date format'),
  barberId: z.string().min(1, 'Barber ID is required'),
  duration: z.number().int().positive().default(30),
  service: z.string().optional().default('Haircut'),
  notes: z.string().optional(),
});

export const cancelAppointmentSchema = z.object({
  id: z.string().min(1, 'Appointment ID is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
