import { createServiceClient } from '@dinenovaai/db/service';
import { toRupees } from '@dinenovaai/utils/money';
import { StatCard } from '@dinenovaai/ui';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const sb = createServiceClient();

  const [{ count: totalRestaurants }, { count: activeRestaurants }, { data: subStats }] = await Promise.all([
    sb.from('restaurants').select('*', { count: 'exact', head: true }),
    sb.from('restaurants').select('*', { count: 'exact', head: true }).eq('is_active', true),
    sb.from('subscriptions')
      .select('status, plans(price_paise)')
      .in('status', ['active', 'trialing']),
  ]);

  const mrr = subStats
    ?.filter(s => s.status === 'active')
    .reduce((acc, s) => acc + ((s.plans as { price_paise?: number } | null)?.price_paise ?? 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-h1 text-neutral-900">Platform Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="MRR" value={toRupees(mrr)} />
        <StatCard label="ARR" value={toRupees(mrr * 12)} />
        <StatCard label="Total Restaurants" value={String(totalRestaurants ?? 0)} />
        <StatCard label="Active Restaurants" value={String(activeRestaurants ?? 0)} />
      </div>
    </div>
  );
}
