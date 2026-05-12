'use client';

import { useState } from 'react';
import { useAppointmentStore, Barber } from '@/lib/appointmentStore';

interface BookingFormProps {
  onSuccess?: () => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const { barbers, availableSlots, createAppointment, fetchBarbers, fetchAvailableSlots, isLoading, error } =
    useAppointmentStore();
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [localError, setLocalError] = useState<string>('');

  const handleBarberChange = async (barberId: string) => {
    setSelectedBarber(barberId);
    setSelectedSlot('');
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    if (selectedBarber && date) {
      await fetchAvailableSlots(selectedBarber, date);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!selectedBarber || !selectedDate || !selectedSlot) {
      setLocalError('Please fill all required fields');
      return;
    }

    try {
      await createAppointment(selectedBarber, selectedSlot, notes);
      setSelectedBarber('');
      setSelectedDate('');
      setSelectedSlot('');
      setNotes('');
      onSuccess?.();
    } catch (error: any) {
      setLocalError(error.response?.data?.error || 'Failed to book appointment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-elevated">
      <div className="mb-8">
        <h2 className="subsection-title">✨ Book Your Appointment</h2>
        <p className="text-gray-400">Select your preferred barber, date, and time slot</p>
      </div>

      {(error || localError) && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400 font-semibold">
          <p className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error || localError}</span>
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Barber Selection */}
        <div>
          <label className="label">Select Barber <span className="text-primary">*</span></label>
          <select
            value={selectedBarber}
            onChange={(e) => handleBarberChange(e.target.value)}
            className="input"
            required
          >
            <option value="">Choose a barber...</option>
            {barbers.map((barber: Barber) => (
              <option key={barber.id} value={barber.id}>
                ✂️ {barber.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label className="label">Select Date <span className="text-primary">*</span></label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="input"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Time Slot Selection */}
        {selectedDate && selectedBarber && (
          <div className="animate-fade-in">
            <label className="label">Select Time Slot <span className="text-primary">*</span></label>
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                <span className="animate-spin inline-block">⏳</span> Loading available slots...
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="p-4 bg-gray-900/60 border border-gray-700 rounded-lg text-gray-400 text-sm text-center">
                No slots available for this date
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`time-slot ${selectedSlot === slot ? 'time-slot-selected' : ''}`}
                  >
                    {new Date(slot).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="label">Notes <span className="text-gray-500">(optional)</span></label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input min-h-24 resize-none"
            placeholder="Any special requests? (e.g., fade cut, beard trim...)"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedBarber || !selectedDate || !selectedSlot}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Booking...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>✓</span> Confirm Booking
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
