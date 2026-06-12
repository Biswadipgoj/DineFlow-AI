import { createServerSupabaseClient } from '@dinenovaai/db/server';
import { notFound } from 'next/navigation';
import MenuPage from './MenuPage';

interface Props {
  params: Promise<{ slug: string; tableCode: string }>;
}

export default async function TablePage({ params }: Props) {
  const supabase = await createServerSupabaseClient();
  const { slug, tableCode } = await params;

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, name, logo_url, slug')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!restaurant) return notFound();

  const { data: table } = await supabase
    .from('dining_tables')
    .select('id, label, branch_id')
    .eq('qr_code', tableCode)
    .eq('is_active', true)
    .single();

  if (!table) return notFound();

  const { data: categories } = await supabase
    .from('menu_categories')
    .select('id, name, sort_order, menu_items(id, name, description, price_paise, image_url, is_veg, is_available, sort_order, gst_rate)')
    .eq('restaurant_id', restaurant.id)
    .eq('is_active', true)
    .order('sort_order');

  return (
    <MenuPage
      restaurant={restaurant}
      table={table}
      tableCode={tableCode}
      categories={categories ?? []}
    />
  );
}
