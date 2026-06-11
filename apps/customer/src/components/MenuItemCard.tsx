'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { toRupees } from '@dinenovaai/utils/money';
import { useCartStore } from '@/store/cartStore';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price_paise: number;
  image_url: string | null;
  is_veg: boolean | null;
  is_available: boolean;
  gst_rate: number;
}

export default function MenuItemCard({ item, restaurantId }: { item: MenuItem; restaurantId: string }) {
  const { items, addItem, updateQty } = useCartStore();
  const cartItem = items.find(i => i.id === item.id);
  const qty = cartItem?.qty ?? 0;

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price_paise: item.price_paise,
      qty: 1,
      modifiers: [],
      gst_rate: item.gst_rate,
    }, restaurantId);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-card border border-neutral-100">
      <div className="relative aspect-video bg-neutral-100">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200" />
        )}
        {item.is_veg !== null && (
          <span className={`absolute top-2 left-2 h-3 w-3 rounded-full border-2 border-white ${
            item.is_veg ? 'bg-green-500' : 'bg-red-500'
          }`} />
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-neutral-900 text-sm leading-tight">{item.name}</h3>
        {item.description && (
          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="font-display font-semibold text-brand-600 text-sm">{toRupees(item.price_paise)}</span>

          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className="px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 active:bg-brand-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-brand-50 rounded-full p-1">
              <button
                onClick={() => updateQty(item.id, qty - 1)}
                className="h-7 w-7 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-sm font-bold text-brand-700 min-w-[1.25rem] text-center">{qty}</span>
              <button
                onClick={handleAdd}
                className="h-7 w-7 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
