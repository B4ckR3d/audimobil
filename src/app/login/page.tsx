'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login gagal');
        setLoading(false);
        return;
      }

      // Use window.location for reliable redirect after login
      window.location.href = '/admin';
    } catch {
      setError('Terjadi kesalahan koneksi');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface-1)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-1)] font-display mb-2 uppercase tracking-[0.15em]">AUDI MOTOR</h1>
          <p className="text-[var(--text-4)] text-sm">Admin Panel Login</p>
        </div>

        <div className="bg-[var(--surface-3)] border border-[var(--border-1)] p-8">
          <h2 className="text-lg font-bold text-[var(--text-1)] mb-6">Masuk ke Dashboard</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-[var(--text-3)] mb-2 uppercase tracking-wider">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--surface-4)] border border-[var(--border-1)] text-[var(--text-1)] placeholder-[var(--text-5)] focus:outline-none focus:border-[var(--accent)] transition-colors text-sm"
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-[var(--text-3)] mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--surface-4)] border border-[var(--border-1)] text-[var(--text-1)] placeholder-[var(--text-5)] focus:outline-none focus:border-[var(--accent)] transition-colors text-sm"
                placeholder="Masukkan password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black font-bold py-3 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-[0.15em]"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>

        <p className="text-center text-[var(--text-5)] text-sm mt-6">
          <a href="/" className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">&larr; Kembali ke Beranda</a>
        </p>
      </div>
    </div>
  );
}
