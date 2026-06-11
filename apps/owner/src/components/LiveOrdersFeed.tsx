'use client';
import { Card, Badge } from '@dinenovaai/ui';
import { toRupees } from '@dinenovaai/utils/money';

const MOCK = [
  { id: '1', order_number: '#0042', table: 'T3', status: 'in_kitchen' as const, total: 89700 },
  { id: '2', order_number: '#0041', table: 'T1', status: 'served' as const, total: 45900 },
  { id: '3', order_number: '#0040', table: 'T5', status: 'paid' as const, total: 123400 },
];

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
  in_kitchen: 'warning',
  served: 'info',
  paid: 'success',
  open: 'neutral',
};

export default function LiveOrdersFeed() {
  return (
    <Card>
      <h3 className="text-h3 text-neutral-800 mb-4">Live Orders</h3>
      <div className="space-y-3">
        {MOCK.map(order => (
          <div key={order.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
            <div>
              <span className="font-medium text-neutral-900">{order.order_number}</span>
              <span className="text-sm text-neutral-500 ml-2">{order.table}</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={STATUS_VARIANT[order.status] ?? 'neutral'}>{order.status}</Badge>
              <span className="font-semibold text-neutral-900">{toRupees(order.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
