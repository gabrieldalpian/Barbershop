'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/lib/authStore';
import { useAppointmentStore, Appointment } from '@/lib/appointmentStore';
import { toast } from '@/components/Toast';

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: 'text-green-700 bg-green-50',
  PENDING: 'text-amber-700 bg-amber-50',
  CANCELLED: 'text-red-700 bg-red-50',
  COMPLETED: 'text-gray-700 bg-gray-50',
};

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const { appointments, fetchAppointments, cancelAppointment } = useAppointmentStore();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const now = new Date();
  const upcoming = useMemo(
    () =>
      appointments.filter(
        (a) => ['CONFIRMED', 'PENDING'].includes(a.status) && new Date(a.date) >= now
      ),
    [appointments]
  );
  const past = useMemo(
    () =>
      appointments.filter(
        (a) =>
          a.status === 'COMPLETED' ||
          a.status === 'CANCELLED' ||
          new Date(a.date) < now
      ),
    [appointments]
  );

  const displayed = tab === 'upcoming' ? upcoming : past;

  const handleCancelRequest = (id: string) => {
    setConfirmId(id);
  };

  const handleCancelConfirm = async () => {
    if (!confirmId) return;
    setCancellingId(confirmId);
    setConfirmId(null);
    try {
      await cancelAppointment(confirmId);
      toast('Appointment cancelled', 'info');
    } catch {
      toast('Failed to cancel appointment', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="pt-16 max-w-4xl mx-auto px-6 py-10 mt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">My Bookings</h1>
            <p className="text-gray-600 text-sm mt-1">Welcome back, {user?.name}</p>
          </div>
          <Link
            href="/book"
            className="px-5 py-2.5 bg-gold-500 text-black font-bold rounded-xl text-sm hover:bg-gold-600 transition-all"
          >
            + Book Now
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: appointments.length },
            { label: 'Upcoming', value: upcoming.length },
            { label: 'Completed', value: appointments.filter((a) => a.status === 'COMPLETED').length },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center"
            >
              <p className="text-3xl font-black text-gold-500">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? 'border-gold-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Inline cancel confirmation */}
        {confirmId && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-4">
            <p className="text-sm text-red-700">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setConfirmId(null)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:text-gray-900 transition-colors"
              >
                Keep it
              </button>
              <button
                onClick={handleCancelConfirm}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Yes, cancel
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-gray-500">No {tab} appointments</p>
            {tab === 'upcoming' && (
              <Link
                href="/book"
                className="inline-block mt-4 text-gold-600 font-semibold hover:text-gold-700 transition-colors text-sm"
              >
                Book one now →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((apt) => (
              <AppointmentCard
                key={apt.id}
                apt={apt}
                onCancel={handleCancelRequest}
                isCancelling={cancellingId === apt.id}
                isPendingConfirm={confirmId === apt.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({
  apt,
  onCancel,
  isCancelling,
  isPendingConfirm,
}: {
  apt: Appointment;
  onCancel: (id: string) => void;
  isCancelling: boolean;
  isPendingConfirm: boolean;
}) {
  const d = new Date(apt.date);
  const canCancel = ['PENDING', 'CONFIRMED'].includes(apt.status);

  return (
    <div
      className={`flex items-center gap-4 bg-gray-50 border rounded-2xl p-4 transition-colors ${
        isPendingConfirm ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Date block */}
      <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-200 flex flex-col items-center justify-center shrink-0">
        <span className="text-gold-600 text-xs font-bold uppercase">
          {d.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-gray-900 font-black text-lg leading-none">{d.getDate()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900">
          {apt.service || 'Haircut'} with {apt.barber?.name ?? 'Barber'}
        </p>
        <p className="text-xs text-gray-600 mt-0.5">
          {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          {apt.notes && ` · ${apt.notes}`}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[apt.status]}`}>
          {apt.status}
        </span>
        {canCancel && (
          <button
            onClick={() => onCancel(apt.id)}
            disabled={isCancelling}
            className="text-xs text-red-600 hover:text-red-700 transition-colors disabled:opacity-40"
          >
            {isCancelling ? 'Cancelling…' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  );
}
