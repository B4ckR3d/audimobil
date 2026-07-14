'use client';

import { useEffect } from 'react';

export default function AdminLogoutPage() {
  useEffect(() => {
    fetch('/api/auth/logout', { method: 'POST' })
      .finally(() => {
        window.location.href = '/login';
      });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--surface-1)] flex items-center justify-center">
      <div className="text-[var(--text-4)] text-sm">Keluar dari sesi...</div>
    </div>
  );
}
