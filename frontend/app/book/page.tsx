'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CalendarPicker from '@/components/CalendarPicker';
import { useAppointmentStore, Barber } from '@/lib/appointmentStore';
import { toast } from '@/components/Toast';

const SERVICES = [
  { name: 'Haircut', price: '$30', duration: '30 min', icon: '✂️' },
  { name: 'Skin Fade', price: '$35', duration: '30 min', icon: '🪒' },
  { name: 'Beard Trim', price: '$20', duration: '20 min', icon: '🧔' },
  { name: 'Full Service', price: '$50', duration: '60 min', icon: '⭐' },
  { name: 'Hot Towel Shave', price: '$25', duration: '30 min', icon: '🔥' },
];

const variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function BookPage() {
  const router = useRouter();
  const { barbers, availableSlots, isLoading, fetchBarbers, fetchAvailableSlots, createAppointment } =
    useAppointmentStore();

  const [step, setStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedService, setSelectedService] = useState(SERVICES[0].name);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [loadingBarbers, setLoadingBarbers] = useState(true);

  useEffect(() => {
    fetchBarbers().finally(() => setLoadingBarbers(false));
  }, []);

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      fetchAvailableSlots(selectedBarber.id, selectedDate);
      setSelectedSlot('');
    }
  }, [selectedBarber, selectedDate]);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const handleConfirm = async () => {
    if (!selectedBarber || !selectedSlot) return;
    setBooking(true);
    try {
      await createAppointment(selectedBarber.id, selectedSlot, selectedService, notes || undefined);
      toast('Appointment booked!', 'success');
      router.push('/dashboard/customer');
    } catch {
      toast('Failed to book appointment', 'error');
    } finally {
      setBooking(false);
    }
  };

  const progressPct = ((step - 1) / 3) * 100 + 33.3;

  const STEP_LABELS = ['Barber', 'Service & Date', 'Time', 'Confirm'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-16 max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Book Appointment</h1>
          <p className="text-gray-500 text-sm">Step {step} of 4 — {STEP_LABELS[step - 1]}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full mb-2 overflow-hidden">
          <motion.div
            className="h-full bg-gold-500 rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {/* Step dots */}
        <div className="flex justify-between mb-10 px-0.5">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i + 1 < step
                    ? 'bg-gold-500 border-gold-500 text-black'
                    : i + 1 === step
                    ? 'border-gold-500 text-gold-600 bg-white'
                    : 'border-gray-200 text-gray-400 bg-white'
                }`}
              >
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i + 1 === step ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Choose barber ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Choose your barber</h2>

              {loadingBarbers ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-5 rounded-xl border border-gray-200 bg-white animate-pulse">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mb-3" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : barbers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">✂</p>
                  <p className="text-gray-500">No barbers available right now.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {barbers.map((barber) => (
                    <button
                      key={barber.id}
                      onClick={() => {
                        setSelectedBarber(barber);
                        setStep(2);
                      }}
                      className={`p-5 rounded-xl border text-left transition-all hover:shadow-md ${
                        selectedBarber?.id === barber.id
                          ? 'border-gold-500 bg-gold-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gold-300'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gold-500 text-black text-lg font-black flex items-center justify-center mb-3 shadow-sm">
                        {barber.name.charAt(0)}
                      </div>
                      <p className="font-bold text-gray-900">{barber.name}</p>
                      {barber.specialty && (
                        <p className="text-xs text-gray-500 mt-0.5">{barber.specialty}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Step 2: Service & date ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select service &amp; date</h2>

              {/* Service selection */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Service
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {SERVICES.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setSelectedService(s.name)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border font-medium transition-all text-left ${
                        selectedService === s.name
                          ? 'bg-gold-50 border-gold-500 text-gray-900'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{s.icon}</span>
                        <div>
                          <span className="font-semibold text-sm">{s.name}</span>
                          <span className="text-xs text-gray-400 ml-2">· {s.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-black text-sm ${selectedService === s.name ? 'text-gold-600' : 'text-gray-900'}`}>
                          {s.price}
                        </span>
                        {selectedService === s.name && (
                          <span className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center text-black text-xs font-black shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date selection */}
              <div className="mb-8">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Date
                </label>
                <CalendarPicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  minDate={minDateStr}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:border-gray-300 hover:text-gray-900 bg-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedDate}
                  className="flex-1 py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Time slot ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">Pick a time</h2>
              <p className="text-sm text-gray-500 mb-6">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric',
                })}
              </p>

              {isLoading ? (
                <div className="grid grid-cols-4 gap-2 mb-8">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="py-2.5 rounded-lg bg-gray-200 animate-pulse h-10" />
                  ))}
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-12 mb-8 bg-white rounded-xl border border-gray-200">
                  <p className="text-3xl mb-2">📅</p>
                  <p className="text-gray-500 text-sm">No available slots for this date.</p>
                  <button
                    onClick={() => setStep(2)}
                    className="mt-3 text-gold-600 text-sm font-semibold hover:text-gold-700 transition-colors"
                  >
                    Try a different date →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 mb-8">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        selectedSlot === slot
                          ? 'bg-gold-500 text-black border-gold-500 font-black shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gold-400 hover:text-gold-700'
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:border-gray-300 bg-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!selectedSlot}
                  className="flex-1 py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Confirm ── */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Confirm your booking</h2>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
                {/* Summary header */}
                <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Booking summary</p>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <SummaryRow label="Barber" value={selectedBarber?.name || ''} />
                  <SummaryRow label="Service" value={`${selectedService} — ${SERVICES.find(s => s.name === selectedService)?.price}`} />
                  <SummaryRow
                    label="Date"
                    value={new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric',
                    })}
                  />
                  <SummaryRow label="Time" value={formatTime(selectedSlot)} />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Notes <span className="text-gray-400 normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/25 transition-colors resize-none text-sm"
                  placeholder="Any requests or preferences (e.g. skin fade on the sides…)"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:border-gray-300 bg-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={booking}
                  className="flex-1 py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
                >
                  {booking ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Booking…
                    </>
                  ) : (
                    'Confirm Booking ✓'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-gray-500 text-sm shrink-0">{label}</span>
      <span className="text-gray-900 font-semibold text-sm text-right">{value}</span>
    </div>
  );
}
