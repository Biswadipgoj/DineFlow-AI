'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { toRupees } from '@dinenovaai/utils/money';
import { useCartStore } from '@/store/cartStore';
import { slideUpFull } from '@dinenovaai/ui/animations';

interface Props {
  restaurantSlug: string;
  tableCode: string;
}

export default function CartBar({ restaurantSlug, tableCode }: Props) {
  const { totalItems, totalPaise } = useCartStore();

  return (
    <motion.div
      {...slideUpFull}
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
    >
      <Link
        href={`/r/${restaurantSlug}/t/${tableCode}/cart`}
        className="flex items-center justify-between bg-brand-500 text-white rounded-2xl px-5 py-4 shadow-bottom"
      >
        <div className="flex items-center gap-3">
          <div className="bg-brand-600 rounded-lg p-1.5">
            <ShoppingCart className="h-4 w-4" />
          </div>
          <span className="font-medium">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold">{toRupees(totalPaise)}</span>
          <span className="text-brand-200">→</span>
        </div>
      </Link>
    </motion.div>
  );
}
