import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { AppointmentInput } from '../utils/validation';

const prisma = new PrismaClient();

export class AppointmentService {
  /**
   * Check for conflicts - prevent double booking
   * Returns true if there's an available slot
   */
  async isSlotAvailable(
    barberId: string,
    startDate: Date,
    durationMinutes: number
  ): Promise<boolean> {
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    // Check for any overlapping appointments
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        barberId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        AND: {
          date: { lte: endDate },
          AND: {
            date: {
              gte: new Date(startDate.getTime() - 30 * 60000), // Consider 30min slots
            },
          },
        },
      },
    });

    return !conflictingAppointment;
  }

  /**
   * Create a new appointment with conflict prevention
   */
  async createAppointment(
    customerId: string,
    barberId: string,
    input: AppointmentInput
  ) {
    const appointmentDate = new Date(input.date);

    // Verify barber exists
    const barber = await prisma.user.findUnique({
      where: { id: barberId },
    });

    if (!barber || barber.role !== 'BARBER') {
      throw new AppError(404, 'Barber not found');
    }

    // Check slot availability
    const isAvailable = await this.isSlotAvailable(
      barberId,
      appointmentDate,
      input.duration
    );

    if (!isAvailable) {
      throw new AppError(
        409,
        'This time slot is not available. Please choose another time.'
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        customerId,
        barberId,
        date: appointmentDate,
        duration: input.duration,
        service: input.service || 'Haircut',
        notes: input.notes,
        status: 'PENDING',
      },
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
        barber: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return appointment;
  }

  /**
   * Get customer's appointments
   */
  async getCustomerAppointments(customerId: string) {
    return prisma.appointment.findMany({
      where: { customerId },
      include: {
        barber: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  /**
   * Get barber's appointments
   */
  async getBarberAppointments(barberId: string) {
    return prisma.appointment.findMany({
      where: { barberId },
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  /**
   * Get available barbers (users with BARBER role)
   */
  async getAvailableBarbers() {
    return prisma.user.findMany({
      where: { role: 'BARBER' },
      select: {
        id: true,
        name: true,
        email: true,
        specialty: true,
        bio: true,
        photoUrl: true,
        rating: true,
        ratingCount: true,
      },
    });
  }

  async confirmAppointment(appointmentId: string, barberId: string) {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) throw new AppError(404, 'Appointment not found');
    if (appointment.barberId !== barberId) throw new AppError(403, 'Unauthorized');
    if (appointment.status !== 'PENDING') throw new AppError(400, 'Only pending appointments can be confirmed');
    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CONFIRMED' },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        barber: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async completeAppointment(appointmentId: string, barberId: string) {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) throw new AppError(404, 'Appointment not found');
    if (appointment.barberId !== barberId) throw new AppError(403, 'Unauthorized');
    if (appointment.status !== 'CONFIRMED') throw new AppError(400, 'Only confirmed appointments can be completed');
    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'COMPLETED' },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        barber: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId: string, userId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new AppError(404, 'Appointment not found');
    }

    // Only customer or barber of this appointment can cancel
    if (appointment.customerId !== userId && appointment.barberId !== userId) {
      throw new AppError(403, 'Unauthorized to cancel this appointment');
    }

    if (appointment.status === 'CANCELLED') {
      throw new AppError(400, 'Appointment is already cancelled');
    }

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CANCELLED' },
      include: {
        customer: { select: { id: true, name: true } },
        barber: { select: { id: true, name: true } },
      },
    });
  }

  /**
   * Get available time slots for a barber on a specific date
   */
  async getAvailableSlots(barberId: string, date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        barberId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      select: { date: true, duration: true },
    });

    // Generate available slots (9 AM - 6 PM, 30-min slots)
    const slots = [];
    const businessHourStart = 9;
    const businessHourEnd = 18;

    for (let hour = businessHourStart; hour < businessHourEnd; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, minute, 0, 0);

        const isBooked = bookedAppointments.some((apt) => {
          const aptStart = new Date(apt.date);
          const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);
          return slotTime >= aptStart && slotTime < aptEnd;
        });

        if (!isBooked) {
          slots.push(slotTime.toISOString());
        }
      }
    }

    return slots;
  }
}
