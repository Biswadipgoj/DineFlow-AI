'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChefHat } from 'lucide-react';
import { kotCard, fadeIn } from '@dinenovaai/ui/animations';
import { createClient } from '@dinenovaai/db/client';
import { subscribeToKOTs } from '@dinenovaai/db/realtime';
import KOTCard from '@/components/KOTCard';

interface KOT {
  id: string;
  kot_number: number;
  order_id: string;
  station: string | null;
  status: string;
  created_at: string;
  orders: {
    order_number: string;
    dining_tables: { label: string } | null;
    order_items: Array<{
      id: string;
      name_snapshot: string;
      qty: number;
      modifiers: Array<{ name: string }>;
      status: string;
    }>;
  };
}

export default function KitchenPage() {
  const [kots, setKots] = useState<KOT[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stationFilter, setStationFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchKOTs = async () => {
      const { data } = await supabase
        .from('kots')
        .select(`
          id, kot_number, order_id, station, status, created_at,
          orders(order_number, dining_tables(label), order_items(id, name_snapshot, qty, modifiers, status))
        `)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: true });

      setKots((data as KOT[]) ?? []);
      setLoading(false);
    };

    fetchKOTs();

    // Realtime subscription requires restaurant_id — stubbed here
    // In production: get restaurantId from auth context
  }, []);

  const stations = ['all', ...new Set(kots.map(k => k.station).filter(Boolean) as string[])];
  const filteredKOTs = stationFilter === 'all' ? kots : kots.filter(k => k.station === stationFilter);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top bar */}
      <header className="bg-neutral-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <ChefHat className="h-5 w-5 text-brand-500" />
          <h1 className="font-display font-bold text-lg">Kitchen Display</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Station filter */}
          <div className="flex gap-1">
            {stations.map(s => (
              <button
                key={s}
                onClick={() => setStationFilter(s)}
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                  stationFilter === s
                    ? 'bg-brand-500 text-white'
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {/* Active count */}
          <span className="bg-brand-500 text-white text-sm font-bold px-2 py-0.5 rounded-full">
            {filteredKOTs.length}
          </span>
          {/* Sound toggle */}
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg hover:bg-neutral-700">
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-neutral-500" />}
          </button>
        </div>
      </header>

      {/* KOT queue */}
      <main className="p-4 space-y-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : filteredKOTs.length === 0 ? (
          <motion.div {...fadeIn} className="flex flex-col items-center justify-center py-20 bg-green-50 rounded-2xl">
            <div className="text-5xl mb-4">✓</div>
            <p className="text-lg font-medium text-green-700">All clear — no pending orders</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredKOTs.map(kot => (
              <motion.div key={kot.id} {...kotCard}>
                <KOTCard kot={kot} onUpdate={(id, status) => {
                  setKots(prev => prev.map(k => k.id === id ? { ...k, status } : k));
                }} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
