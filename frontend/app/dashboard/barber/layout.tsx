import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Barber Dashboard — NJIT Cuts',
};

export default function BarberLayout({ children }: { children: React.ReactNode }) {
  return children;
}
