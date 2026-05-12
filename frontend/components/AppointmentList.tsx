'use client';

import { Appointment } from '@/lib/appointmentStore';

interface AppointmentListProps {
  appointments: Appointment[];
  onCancel: (id: string) => void;
  isLoading?: boolean;
}

export default function AppointmentList({ appointments, onCancel, isLoading }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">No appointments yet</p>
        <p className="text-gray-500 text-sm mt-2">Appointments will appear here once booked</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((apt) => (
        <div
          key={apt.id}
          className="card-elevated"
          style={{
            borderLeftWidth: '3px',
            borderLeftColor:
              apt.status === 'CONFIRMED' || apt.status === 'COMPLETED'
                ? 'rgba(16, 185, 129, 0.5)'
                : apt.status === 'PENDING'
                ? 'rgba(245, 158, 11, 0.5)'
                : 'rgba(239, 68, 68, 0.4)',
          }}
        >
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1">
              {/* Date & Time */}
              <p className="text-lg font-bold text-primary mb-1">
                {new Date(apt.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-white text-xl font-semibold mb-4">
                {new Date(apt.date).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>

              {/* Details */}
              <div className="space-y-2 text-gray-300">
                {apt.barber && (
                  <p className="flex items-center gap-2">
                    <span className="text-primary">✂️</span>
                    <span>Barber: <span className="text-white font-semibold">{apt.barber.name}</span></span>
                  </p>
                )}
                {apt.customer && (
                  <p className="flex items-center gap-2">
                    <span className="text-primary">👤</span>
                    <span>Customer: <span className="text-white font-semibold">{apt.customer.name}</span></span>
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <span className="text-primary">⏱️</span>
                  <span>Duration: <span className="text-white font-semibold">{apt.duration} minutes</span></span>
                </p>
              </div>

              {/* Notes */}
              {apt.notes && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm font-semibold mb-1">Notes:</p>
                  <p className="text-gray-300 text-sm">{apt.notes}</p>
                </div>
              )}
            </div>

            {/* Status & Actions */}
            <div className="flex flex-col items-end gap-3 whitespace-nowrap">
              <span
                className={`
                  ${apt.status === 'CONFIRMED' ? 'badge-confirmed' : ''}
                  ${apt.status === 'CANCELLED' ? 'badge-cancelled' : ''}
                  ${apt.status === 'PENDING' ? 'badge-pending' : ''}
                  ${apt.status === 'COMPLETED' ? 'badge-confirmed' : ''}
                `}
              >
                {apt.status === 'COMPLETED'
                  ? '✓ Completed'
                  : apt.status === 'CONFIRMED'
                  ? '✓ Confirmed'
                  : apt.status === 'PENDING'
                  ? '⏳ Pending'
                  : '✕ Cancelled'}
              </span>

              {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                <button
                  onClick={() => onCancel(apt.id)}
                  disabled={isLoading}
                  className="btn-danger !px-3 !py-2 !text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
