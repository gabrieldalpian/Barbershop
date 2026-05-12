'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/lib/authStore';
import { useAppointmentStore, Appointment } from '@/lib/appointmentStore';
import { toast } from '@/components/Toast';

type FilterTab = 'all' | 'today' | 'upcoming' | 'confirmed' | 'completed';

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: 'text-green-700 bg-green-50',
  PENDING: 'text-amber-700 bg-amber-50',
  CANCELLED: 'text-red-700 bg-red-50',
  COMPLETED: 'text-gray-700 bg-gray-50',
};

export default function BarberDashboard() {
  const { user } = useAuthStore();
  const { appointments, fetchAppointments, confirmAppointment, completeAppointment, cancelAppointment } =
    useAppointmentStore();
  const [filter, setFilter] = useState<FilterTab>('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'today':
        return appointments.filter((a) => {
          const d = new Date(a.date);
          return d >= todayStart && d <= todayEnd;
        });
      case 'upcoming':
        return appointments.filter(
          (a) => ['PENDING', 'CONFIRMED'].includes(a.status) && new Date(a.date) > now
        );
      case 'confirmed':
        return appointments.filter((a) => a.status === 'CONFIRMED');
      case 'completed':
        return appointments.filter((a) => a.status === 'COMPLETED');
      default:
        return appointments;
    }
  }, [appointments, filter]);

  const todayApts = useMemo(
    () =>
      appointments
        .filter((a) => {
          const d = new Date(a.date);
          return d >= todayStart && d <= todayEnd && ['CONFIRMED', 'PENDING'].includes(a.status);
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [appointments]
  );

  const handleConfirm = async (id: string) => {
    try {
      await confirmAppointment(id);
      toast('Appointment confirmed', 'success');
    } catch {
      toast('Failed to confirm', 'error');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeAppointment(id);
      toast('Marked as complete', 'success');
    } catch {
      toast('Failed to complete', 'error');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id);
      toast('Appointment cancelled', 'info');
    } catch {
      toast('Failed to cancel', 'error');
    }
  };

  const TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="pt-16 max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black mt-20">Barber Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">Welcome, {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: appointments.length },
            { label: 'Today', value: todayApts.length },
            { label: 'Confirmed', value: appointments.filter((a) => a.status === 'CONFIRMED').length },
            { label: 'Completed', value: appointments.filter((a) => a.status === 'COMPLETED').length },
          ].map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500" />
              <p className="text-3xl font-black text-gold-500">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Today's schedule */}
        {todayApts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Today's Schedule</h2>
            <div className="space-y-2">
              {todayApts.map((apt) => (
                <AppointmentRow
                  key={apt.id}
                  apt={apt}
                  onConfirm={handleConfirm}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                filter === t.key
                  ? 'border-gold-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Appointment list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-gray-500">No appointments here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((apt) => (
              <AppointmentRow
                key={apt.id}
                apt={apt}
                onConfirm={handleConfirm}
                onComplete={handleComplete}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentRow({
  apt,
  onConfirm,
  onComplete,
  onCancel,
}: {
  apt: Appointment;
  onConfirm: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const d = new Date(apt.date);
  return (
    <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:border-gray-300 transition-colors">
      {/* Date block */}
      <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-200 flex flex-col items-center justify-center shrink-0">
        <span className="text-gold-600 text-xs font-bold uppercase">
          {d.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-gray-900 font-black text-lg leading-none">{d.getDate()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900">
          {apt.customer?.name ?? 'Customer'} — {apt.service || 'Haircut'}
        </p>
        <p className="text-xs text-gray-600 mt-0.5">
          {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          {apt.notes && ` · ${apt.notes}`}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[apt.status]}`}>
          {apt.status}
        </span>
        {apt.status === 'PENDING' && (
          <button
            onClick={() => onConfirm(apt.id)}
            className="px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors"
          >
            Confirm
          </button>
        )}
        {apt.status === 'CONFIRMED' && (
          <button
            onClick={() => onComplete(apt.id)}
            className="px-3 py-1 rounded-lg bg-gold-50 text-gold-700 text-xs font-semibold hover:bg-gold-100 transition-colors"
          >
            Complete
          </button>
        )}
        {['PENDING', 'CONFIRMED'].includes(apt.status) && (
          <button
            onClick={() => onCancel(apt.id)}
            className="px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
