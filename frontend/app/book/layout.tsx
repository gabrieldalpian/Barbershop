import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Appointment — Cuts',
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
