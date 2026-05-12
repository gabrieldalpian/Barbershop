'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    router.replace(user.role === 'BARBER' ? '/dashboard/barber' : '/dashboard/customer');
  }, [user, router]);

  return null;
}
