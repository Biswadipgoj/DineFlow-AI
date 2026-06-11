'use client';
import { useCartStore } from '@/store/cartStore';
import { toRupees } from '@dinenovaai/utils/money';
import { gstInclusive } from '@dinenovaai/utils/gst';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function CartPage() {
  const params = useParams();
  const { items, updateQty, removeItem, totalPaise } = useCartStore();

  const gstTotal = items.reduce((acc, item) => {
    const gst = gstInclusive(item.price_paise * item.qty, item.gst_rate);
    return acc + gst.cgst_paise + gst.sgst_paise;
  }, 0);
  const subtotal = totalPaise - gstTotal;

  return (
    <div className="min-h-screen bg-surface-base">
      <header className="bg-white border-b border-neutral-200 px-4 py-4">
        <h1 className="text-h2 text-neutral-900">Your Order</h1>
      </header>

      <div className="px-4 py-4 space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-card flex items-center gap-4">
            <div className="flex-1">
              <p className="font-medium text-neutral-900">{item.name}</p>
              <p className="text-sm text-brand-600 font-semibold">{toRupees(item.price_paise)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, item.qty - 1)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200">
                {item.qty === 1 ? <Trash2 className="h-3.5 w-3.5 text-red-500" /> : <Minus className="h-3.5 w-3.5" />}
              </button>
              <span className="w-6 text-center font-bold">{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)}
                className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="font-semibold text-neutral-900 w-20 text-right">{toRupees(item.price_paise * item.qty)}</p>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-card space-y-2">
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Subtotal</span>
          <span>{toRupees(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-neutral-600">
          <span>GST</span>
          <span>{toRupees(gstTotal)}</span>
        </div>
        <div className="border-t border-neutral-200 pt-2 flex justify-between font-display font-bold text-neutral-900">
          <span>Total</span>
          <span>{toRupees(totalPaise)}</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200">
        <button className="w-full py-4 rounded-2xl bg-brand-500 text-white font-display font-semibold text-lg hover:bg-brand-600">
          Place Order — {toRupees(totalPaise)}
        </button>
      </div>
    </div>
  );
}
