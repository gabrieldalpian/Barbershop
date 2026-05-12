'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();

  const validate = () => {
    const e: typeof errors = {};
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
      await login(email, password);
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
            <div className="mb-10">
              <h1 className="text-4xl font-black text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                {isLoading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-8">
              No account?{' '}
              <Link href="/register" className="text-gold-600 font-semibold hover:text-gold-700 transition-colors">
                Create one
              </Link>
            </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
