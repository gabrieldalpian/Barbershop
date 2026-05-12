import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Bookings — Cuts',
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
