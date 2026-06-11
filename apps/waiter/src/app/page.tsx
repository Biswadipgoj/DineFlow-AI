'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter } from 'lucide-react';
import { fadeIn } from '@dinenovaai/ui/animations';
import { createClient } from '@dinenovaai/db/client';

type SessionStatus = 'open' | 'bill_requested' | 'settled' | 'cancelled';

interface TableSession {
  id: string;
  table_id: string;
  status: SessionStatus;
  guest_count: number | null;
  opened_at: string;
  dining_tables: {
    label: string;
    area: string | null;
    capacity: number | null;
  };
}

const STATUS_BG: Record<SessionStatus, string> = {
  open: '#fef9c3',
  bill_requested: '#fee2e2',
  settled: '#dcfce7',
  cancelled: '#f5f5f4',
};

const STATUS_LABEL: Record<SessionStatus, string> = {
  open: 'Occupied',
  bill_requested: 'Bill Requested',
  settled: 'Free',
  cancelled: 'Cancelled',
};

type Filter = 'all' | 'open' | 'bill_requested' | 'free';

export default function WaiterPage() {
  const [sessions, setSessions] = useState<TableSession[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('table_sessions')
      .select('id, table_id, status, guest_count, opened_at, dining_tables(label, area, capacity)')
      .in('status', ['open', 'bill_requested'])
      .then(({ data }) => {
        setSessions((data as TableSession[]) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = sessions.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'free') return s.status === 'settled';
    return s.status === filter;
  });

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display font-bold text-xl text-neutral-900">Tables</h1>
          <span className="text-sm text-neutral-500">{sessions.length} active</span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(['all', 'open', 'bill_requested', 'free'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                filter === f ? 'bg-brand-500 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}>
              {f === 'bill_requested' ? 'Bill Requested' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
        {filtered.map(session => {
          const elapsed = Math.floor((Date.now() - new Date(session.opened_at).getTime()) / 60000);
          return (
            <motion.div key={session.id} {...fadeIn}
              className="rounded-xl p-3 cursor-pointer border-2 border-transparent hover:border-brand-300 transition-all"
              style={{ backgroundColor: STATUS_BG[session.status] }}
              onClick={() => {/* navigate to /t/[sessionId] */}}>
              <p className="font-display font-bold text-xl text-neutral-900">{session.dining_tables?.label}</p>
              {session.dining_tables?.area && (
                <p className="text-xs text-neutral-500">{session.dining_tables.area}</p>
              )}
              {session.guest_count && (
                <p className="text-xs text-neutral-600 mt-1">{session.guest_count} guests</p>
              )}
              <p className="text-xs font-medium text-neutral-600 mt-1">{elapsed}m</p>
              {session.status === 'bill_requested' && (
                <motion.p
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xs font-bold text-red-600 mt-1">
                  Bill Requested
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </main>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-500 text-white shadow-card-lg flex items-center justify-center hover:bg-brand-600 active:scale-95 transition-all">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
