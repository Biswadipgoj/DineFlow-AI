import { createServerSupabaseClient } from '@dinenovaai/db/server';
import { toRupees } from '@dinenovaai/utils/money';
import { StatCard } from '@dinenovaai/ui';
import RevenueChart from '@/components/RevenueChart';
import LiveOrdersFeed from '@/components/LiveOrdersFeed';

interface RestaurantMetrics {
  today_revenue_paise: number;
  yesterday_revenue_paise: number;
  week_revenue_paise: number;
  today_orders: number;
  avg_ticket_paise: number;
  low_stock_count: number;
  open_orders: number;
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const { data: userData } = await supabase.auth.getUser();
  const restaurantId =
    (userData.user?.app_metadata?.restaurant_id as string | undefined) ?? '';

  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase.rpc('get_restaurant_metrics', {
    p_restaurant_id: restaurantId,
    p_date: today,
  });

  const metrics = (data ?? {}) as Partial<RestaurantMetrics>;

  return (
    <div className="space-y-6">
      <h1 className="text-h1 text-neutral-900">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue Today" value={toRupees(metrics.today_revenue_paise ?? 0)} />
        <StatCard label="Orders Today" value={String(metrics.today_orders ?? 0)} />
        <StatCard label="Avg Ticket" value={toRupees(metrics.avg_ticket_paise ?? 0)} />
        <StatCard label="Open Orders" value={String(metrics.open_orders ?? 0)} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <LiveOrdersFeed />
      </div>
    </div>
  );
}
