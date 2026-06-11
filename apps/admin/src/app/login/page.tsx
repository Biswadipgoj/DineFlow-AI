'use client';
import { useState } from 'react';
import { createClient } from '@dinenovaai/db/client';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="bg-neutral-800 rounded-2xl p-8 w-full max-w-sm border border-neutral-700">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl text-brand-500">DineNova</h1>
          <p className="text-neutral-400 mt-1">Admin Panel</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-300">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              required />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-300">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              required />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
