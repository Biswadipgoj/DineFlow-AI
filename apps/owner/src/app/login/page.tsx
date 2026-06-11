'use client';
import { useState } from 'react';
import { createClient } from '@dinenovaai/db/client';
import { useRouter } from 'next/navigation';
import { Button } from '@dinenovaai/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-card-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl text-brand-600">DineNova</h1>
          <p className="text-neutral-500 mt-1">Owner Portal</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              required />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
