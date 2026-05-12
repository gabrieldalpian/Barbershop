'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SPECIALTIES = [
  'Fade Specialist',
  'Beard Expert',
  'Classic Cuts',
  'Modern Styles',
  'Color & Highlights',
  'Kids Cuts',
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'BARBER'>('CUSTOMER');
  const [specialty, setSpecialty] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading, error } = useAuthStore();
  const router = useRouter();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(name, email, password, role, specialty || undefined);
      const user = useAuthStore.getState().user;
      router.push(user?.role === 'BARBER' ? '/dashboard/barber' : '/dashboard/customer');
    } catch {}
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      {/* Blurred background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/backgroundPhoto.jpg)',
          filter: 'blur(10px)',
          zIndex: 0,
        }}
      />

      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/40 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center w-full">
        {/* Form container */}
        <div className="w-full flex justify-center items-center px-6 sm:px-12">
          <div className="w-full max-w-lg">
            <div className="mb-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 text-3xl font-black text-white mb-8 hover:text-gold-400 transition-colors"
              >
                ✦ NJIT CUTZ
              </Link>
            </div>

            {/* Form card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join our barbershop community</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${
                    errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/25' : 'border-gray-200 focus:border-gold-500 focus:ring-gold-500/25'
                  }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1.5">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${
                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/25' : 'border-gray-200 focus:border-gold-500 focus:ring-gold-500/25'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1.5">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${
                    errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/25' : 'border-gray-200 focus:border-gold-500 focus:ring-gold-500/25'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1.5">{errors.password}</p>
                )}
              </div>

              {/* Role toggle */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  I am a…
                </label>
                <div className="flex gap-3">
                  {(['CUSTOMER', 'BARBER'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border transition-all ${
                        role === r
                          ? 'bg-gold-500 text-black border-gold-500'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gold-300'
                      }`}
                    >
                      {r === 'CUSTOMER' ? '👤 Customer' : '✂ Barber'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialty — barbers only */}
              {role === 'BARBER' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Specialty
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/25 transition-colors"
                  >
                    <option value="">Select specialty…</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gold-500 text-black font-bold rounded-xl hover:bg-gold-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-3 flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {isLoading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-8">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-gold-600 font-semibold hover:text-gold-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
