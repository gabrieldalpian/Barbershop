'use client';

import { useAuthStore } from '@/lib/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push('/');
  };

  const dashboardPath = user?.role === 'BARBER' ? '/dashboard/barber' : '/dashboard/customer';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
        scrolled ? 'shadow-md border-b border-gray-200' : 'border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-black tracking-tight text-gray-900 hover:text-gold-600 transition-colors shrink-0"
        >
          ✦ NJIT CUTZ
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#services" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Services
          </Link>
          <Link href="/#barbers" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Barbers
          </Link>
          <Link href="/#reviews" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Reviews
          </Link>
          <Link href="/#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
            How it works
          </Link>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-4 shrink-0">
          {hydrated && !user ? (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Log in
              </Link>
              <Link href="/book" className="btn-primary text-sm">
                Book appointment
              </Link>
            </>
          ) : hydrated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full bg-gold-500 text-gray-900 text-sm font-black flex items-center justify-center hover:bg-gold-600 transition-colors shadow-sm"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-scale-in">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <Link
                      href={dashboardPath}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                    {user.role === 'CUSTOMER' && (
                      <Link
                        href="/book"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
                      >
                        Book Appointment
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
