import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointmentService';
import { AppError } from '../utils/errors';
import { AppointmentInput } from '../utils/validation';

const appointmentService = new AppointmentService();

export class AppointmentController {
  async createAppointment(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const input = req.body as AppointmentInput;
      const appointment = await appointmentService.createAppointment(
        req.user.id,
        input.barberId,
        input
      );

      res.status(201).json({
        message: 'Appointment booked successfully',
        appointment,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create appointment' });
      }
    }
  }

  async getMyAppointments(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (req.user.role === 'BARBER') {
        const appointments = await appointmentService.getBarberAppointments(
          req.user.id
        );
        res.status(200).json({ appointments });
      } else {
        const appointments = await appointmentService.getCustomerAppointments(
          req.user.id
        );
        res.status(200).json({ appointments });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  }

  async cancelAppointment(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { appointmentId } = req.params;
      const appointment = await appointmentService.cancelAppointment(
        appointmentId,
        req.user.id
      );

      res.status(200).json({
        message: 'Appointment cancelled successfully',
        appointment,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to cancel appointment' });
      }
    }
  }

  async confirmAppointment(req: Request, res: Response) {
    try {
      if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
      const { appointmentId } = req.params;
      const appointment = await appointmentService.confirmAppointment(appointmentId, req.user.id);
      res.status(200).json({ message: 'Appointment confirmed', appointment });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to confirm appointment' });
      }
    }
  }

  async completeAppointment(req: Request, res: Response) {
    try {
      if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
      const { appointmentId } = req.params;
      const appointment = await appointmentService.completeAppointment(appointmentId, req.user.id);
      res.status(200).json({ message: 'Appointment completed', appointment });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to complete appointment' });
      }
    }
  }

  async getAvailableBarbers(req: Request, res: Response) {
    try {
      const barbers = await appointmentService.getAvailableBarbers();
      res.status(200).json({ barbers });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch barbers' });
    }
  }

  async getAvailableSlots(req: Request, res: Response) {
    try {
      const { barberId, date } = req.query;

      if (!barberId || !date) {
        res.status(400).json({ error: 'barberId and date are required' });
        return;
      }

      const slots = await appointmentService.getAvailableSlots(
        barberId as string,
        date as string
      );

      res.status(200).json({ slots });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch available slots' });
    }
  }
}
