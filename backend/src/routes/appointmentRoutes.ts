import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { authMiddleware, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { appointmentSchema } from '../utils/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const appointmentController = new AppointmentController();

// Get available barbers (public)
router.get(
  '/barbers',
  asyncHandler((req, res) => appointmentController.getAvailableBarbers(req, res))
);

// Get available slots for a barber (public)
router.get(
  '/available-slots',
  asyncHandler((req, res) =>
    appointmentController.getAvailableSlots(req, res)
  )
);

// All routes below require authentication
router.use(authMiddleware);

// Create appointment (customers)
router.post(
  '/',
  requireRole(['CUSTOMER']),
  validateRequest(appointmentSchema),
  asyncHandler((req, res) => appointmentController.createAppointment(req, res))
);

// Get user's appointments (customer or barber)
router.get(
  '/',
  asyncHandler((req, res) => appointmentController.getMyAppointments(req, res))
);

// Cancel appointment
router.delete(
  '/:appointmentId',
  asyncHandler((req, res) =>
    appointmentController.cancelAppointment(req, res)
  )
);

// Confirm appointment (barbers only)
router.patch(
  '/:appointmentId/confirm',
  requireRole(['BARBER']),
  asyncHandler((req, res) => appointmentController.confirmAppointment(req, res))
);

// Complete appointment (barbers only)
router.patch(
  '/:appointmentId/complete',
  requireRole(['BARBER']),
  asyncHandler((req, res) => appointmentController.completeAppointment(req, res))
);

export default router;
