import { createServiceClient } from '@dinenovaai/db/service';
import { Badge } from '@dinenovaai/ui';
import { toRupees } from '@dinenovaai/utils/money';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RestaurantsPage() {
  const sb = createServiceClient();
  const { data: restaurants } = await sb
    .from('restaurants')
    .select('id, name, slug, city, is_active, created_at, subscriptions(status, plans(code, name, price_paise))')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-neutral-900">Restaurants</h1>
        <Link href="/restaurants/new"
          className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600">
          + New Restaurant
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">Restaurant</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">Plan</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">City</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {restaurants?.map(r => {
              const sub = Array.isArray(r.subscriptions) ? r.subscriptions[0] : r.subscriptions;
              const plan = sub ? (sub.plans as { code?: string; name?: string; price_paise?: number } | null) : null;
              return (
                <tr key={r.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">{r.name}</p>
                    <p className="text-xs text-neutral-500">{r.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    {plan ? (
                      <Badge variant={plan.code === 'ai' ? 'info' : plan.code === 'enterprise' ? 'warning' : 'neutral'}>
                        {plan.name}
                      </Badge>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={r.is_active ? 'success' : 'error'}>
                      {r.is_active ? 'Active' : 'Suspended'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{r.city ?? '-'}</td>
                  <td className="px-4 py-3">
                    <Link href={`/restaurants/${r.id}`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
