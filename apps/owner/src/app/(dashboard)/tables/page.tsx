import { createServerSupabaseClient } from '@dinenovaai/db/server';
import { QrCode, Plus } from 'lucide-react';
import { Button } from '@dinenovaai/ui';
import Link from 'next/link';

export default async function TablesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: tables } = await supabase
    .from('dining_tables')
    .select('id, label, capacity, area, qr_code, is_active')
    .order('label');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-neutral-900">Tables & QR Codes</h1>
        <Link href="/tables/new">
          <Button variant="primary" size="md" className="gap-2">
            <Plus className="h-4 w-4" /> Add Table
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tables?.map(table => (
          <div key={table.id} className="bg-white rounded-xl p-4 shadow-card">
            <h3 className="font-display font-bold text-2xl text-neutral-900">{table.label}</h3>
            {table.area && <p className="text-sm text-neutral-500">{table.area}</p>}
            {table.capacity && <p className="text-xs text-neutral-400 mt-1">{table.capacity} seats</p>}
            <div className="flex gap-2 mt-3">
              <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-brand-50 text-brand-600 text-xs font-medium hover:bg-brand-100">
                <QrCode className="h-3 w-3" />
                QR
              </button>
              <Link href={`/tables/${table.id}`}>
                <button className="px-2 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 text-xs font-medium hover:bg-neutral-200">
                  Edit
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
