'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { toRupees } from '@dinenovaai/utils/money';
import { bounceIn, slideUp } from '@dinenovaai/ui/animations';
import { useCartStore } from '@/store/cartStore';
import MenuItemCard from '@/components/MenuItemCard';
import CartBar from '@/components/CartBar';

interface Props {
  restaurant: { id: string; name: string; logo_url: string | null; slug: string };
  table: { id: string; label: string; branch_id: string };
  tableCode: string;
  categories: Array<{
    id: string;
    name: string;
    sort_order: number;
    menu_items: Array<{
      id: string;
      name: string;
      description: string | null;
      price_paise: number;
      image_url: string | null;
      is_veg: boolean | null;
      is_available: boolean;
      sort_order: number;
      gst_rate: number;
    }>;
  }>;
}

export default function MenuPage({ restaurant, table, tableCode, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? '');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const cart = useCartStore();

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-surface-base pb-24">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {restaurant.logo_url && (
              <img src={restaurant.logo_url} alt={restaurant.name} className="h-8 w-8 rounded-full object-cover" />
            )}
            <div>
              <h1 className="font-display font-semibold text-neutral-900 text-sm">{restaurant.name}</h1>
              <p className="text-xs text-neutral-500">Table {table.label}</p>
            </div>
          </div>
          <button
            className="relative p-2 rounded-full hover:bg-neutral-100"
            onClick={() => {/* open cart */}}
          >
            <ShoppingCart className="h-5 w-5 text-neutral-700" />
            {cart.totalItems > 0 && (
              <motion.span
                {...bounceIn}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold"
              >
                {cart.totalItems}
              </motion.span>
            )}
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Menu sections */}
      <main className="px-4 py-4 space-y-8">
        {categories.map((cat) => (
          <section
            key={cat.id}
            ref={(el) => { sectionRefs.current[cat.id] = el; }}
          >
            <h2 className="text-h3 text-neutral-800 mb-4">{cat.name}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {cat.menu_items
                .filter(item => item.is_available)
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    restaurantId={restaurant.id}
                  />
                ))}
            </div>
          </section>
        ))}
      </main>

      {/* Cart bar */}
      <AnimatePresence>
        {cart.totalItems > 0 && (
          <CartBar
            restaurantSlug={restaurant.slug}
            tableCode={tableCode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
