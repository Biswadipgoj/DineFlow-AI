import { createServerSupabaseClient } from '@dinenovaai/db/server';
import { toRupees } from '@dinenovaai/utils/money';
import { StatCard } from '@dinenovaai/ui';
import RevenueChart from '@/components/RevenueChart';
import LiveOrdersFeed from '@/components/LiveOrdersFeed';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const today = new Date().toISOString().split('T')[0];
  const { data: metrics } = await supabase.rpc('get_restaurant_metrics', {
    p_restaurant_id: (await supabase.auth.getUser()).data.user?.user_metadata?.restaurant_id ?? '',
    p_date: today,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-h1 text-neutral-900">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue Today"
          value={toRupees((metrics as { today_revenue_paise?: number })?.today_revenue_paise ?? 0)}
        />
        <StatCard
          label="Orders Today"
          value={String((metrics as { today_orders?: number })?.today_orders ?? 0)}
        />
        <StatCard
          label="Avg Ticket"
          value={toRupees((metrics as { avg_ticket_paise?: number })?.avg_ticket_paise ?? 0)}
        />
        <StatCard
          label="Open Orders"
          value={String((metrics as { open_orders?: number })?.open_orders ?? 0)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <LiveOrdersFeed />
      </div>
    </div>
  );
}
