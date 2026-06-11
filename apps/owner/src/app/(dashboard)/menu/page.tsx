import { createServerSupabaseClient } from '@dinenovaai/db/server';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@dinenovaai/ui';

export default async function MenuPage() {
  const supabase = await createServerSupabaseClient();
  const { data: categories } = await supabase
    .from('menu_categories')
    .select('id, name, sort_order, is_active, menu_items(count)')
    .order('sort_order');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-neutral-900">Menu</h1>
        <Link href="/menu/categories/new">
          <Button variant="primary" size="md" className="gap-2">
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {categories?.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl p-4 shadow-card flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-900">{cat.name}</h3>
              <p className="text-sm text-neutral-500">
                {Array.isArray(cat.menu_items) ? cat.menu_items.length : 0} items
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                {cat.is_active ? 'Active' : 'Inactive'}
              </span>
              <Link href={`/menu/categories/${cat.id}`}>
                <Button variant="secondary" size="sm">Edit</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
