'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@dinenovaai/db/client';

interface KOT {
  id: string;
  kot_number: number;
  order_id: string;
  station: string | null;
  created_at: string;
  orders: {
    order_number: string;
    table_sessions: { dining_tables: { label: string } | null } | null;
    order_items: Array<{
      id: string;
      name_snapshot: string;
      qty: number;
      modifiers: Array<{ name: string }>;
      status: string;
    }>;
  };
}

function TimeElapsed({ createdAt }: { createdAt: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const update = () => setElapsed(Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [createdAt]);

  const color = elapsed < 10 ? 'bg-green-100 text-green-700' : elapsed < 15 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{elapsed}m</span>;
}

type ItemStatus = 'queued' | 'cooking' | 'ready' | 'served' | 'cancelled';

const STATUS_CYCLE: Partial<Record<ItemStatus, ItemStatus>> = { queued: 'cooking', cooking: 'ready' };
const STATUS_COLORS: Record<string, string> = {
  queued: 'bg-blue-100 text-blue-700',
  cooking: 'bg-amber-100 text-amber-700',
  ready: 'bg-green-100 text-green-700',
};

export default function KOTCard({ kot, onUpdate }: { kot: KOT; onUpdate: (id: string, status: string) => void }) {
  const [itemStatuses, setItemStatuses] = useState<Record<string, ItemStatus>>(
    Object.fromEntries(kot.orders.order_items.map(i => [i.id, i.status as ItemStatus]))
  );
  const supabase = createClient();

  const allReady = Object.values(itemStatuses).every(s => s === 'ready');

  const advanceStatus = async (itemId: string) => {
    const current = itemStatuses[itemId];
    const next = STATUS_CYCLE[current];
    if (!next) return;
    setItemStatuses(prev => ({ ...prev, [itemId]: next }));
    await supabase.from('order_items').update({ status: next }).eq('id', itemId);
  };

  const markDone = async () => {
    await supabase.from('orders').update({ status: 'ready' }).eq('id', kot.order_id);
    await supabase.from('kots').update({ status: 'printed' }).eq('id', kot.id);
    onUpdate(kot.id, 'printed');
  };

  return (
    <div className={`rounded-2xl overflow-hidden border-2 transition-colors ${allReady ? 'border-green-400 bg-green-50' : 'border-neutral-200 bg-white'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-2xl text-neutral-900">
            {kot.orders.order_number}
          </span>
          {kot.orders.table_sessions?.dining_tables && (
            <span className="bg-neutral-100 text-neutral-700 text-sm font-medium px-2 py-0.5 rounded-lg">
              {kot.orders.table_sessions.dining_tables.label}
            </span>
          )}
        </div>
        <TimeElapsed createdAt={kot.created_at} />
      </div>

      {/* Items */}
      <div className="px-4 py-3 space-y-3">
        {kot.orders.order_items.map(item => (
          <div key={item.id} className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <span className="h-7 w-7 rounded-full bg-brand-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                {item.qty}
              </span>
              <div>
                <p className="font-medium text-neutral-900 text-base">{item.name_snapshot}</p>
                {Array.isArray(item.modifiers) && item.modifiers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.modifiers.map((m: { name: string }, i: number) => (
                      <span key={i} className="bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 rounded-full">{m.name}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => advanceStatus(item.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${STATUS_COLORS[itemStatuses[item.id] ?? 'queued'] ?? 'bg-neutral-100 text-neutral-600'}`}
            >
              {itemStatuses[item.id] ?? 'queued'}
            </button>
          </div>
        ))}
      </div>

      {/* Mark done */}
      {allReady && (
        <div className="px-4 pb-4">
          <button
            onClick={markDone}
            className="w-full py-4 rounded-xl bg-green-500 text-white font-display font-bold text-lg hover:bg-green-600"
          >
            ✓ Mark Done
          </button>
        </div>
      )}

      {kot.station && (
        <div className="px-4 pb-2">
          <span className="text-xs text-neutral-400">Station: {kot.station}</span>
        </div>
      )}
    </div>
  );
}
