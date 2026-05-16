'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ToastType = 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

// 전역 토스트 이벤트 버스
const listeners: ((toast: Omit<ToastItem, 'id'>) => void)[] = [];

export function toast(message: string, type: ToastType = 'success') {
  listeners.forEach((fn) => fn({ message, type }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (item: Omit<ToastItem, 'id'>) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { ...item, id }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={cn(
            'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-md text-sm',
            t.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          )}
        >
          {t.type === 'success'
            ? <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            : <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />}
          <span>{t.message}</span>
          <button
            type="button"
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="ml-auto outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="닫기"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
