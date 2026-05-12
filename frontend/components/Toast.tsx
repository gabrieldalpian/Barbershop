'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
const listeners: ((toasts: ToastItem[]) => void)[] = [];
let toasts: ToastItem[] = [];

function notify() {
  listeners.forEach((fn) => fn([...toasts]));
}

export function toast(message: string, type: ToastType = 'info') {
  const id = ++toastId;
  toasts = [...toasts, { id, message, type }];
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 4000);
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const STYLES: Record<ToastType, string> = {
  success: 'bg-[#F7DF1E] text-black',
  error: 'bg-red-500 text-white',
  info: 'bg-gray-800 text-white border border-white/10',
};

export function Toast() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.push(setItems);
    return () => {
      const i = listeners.indexOf(setItems);
      if (i !== -1) listeners.splice(i, 1);
    };
  }, []);

  if (!items.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl animate-slide-up pointer-events-auto max-w-xs ${STYLES[item.type]}`}
        >
          <span className="text-base leading-none font-bold shrink-0">
            {ICONS[item.type]}
          </span>
          <span>{item.message}</span>
        </div>
      ))}
    </div>
  );
}
