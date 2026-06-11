import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price_paise: number;
  qty: number;
  modifiers: Array<{ name: string; price_delta_paise: number }>;
  notes?: string;
  gst_rate: number;
}

interface CartStore {
  items: CartItem[];
  restaurantId: string | null;
  totalItems: number;
  totalPaise: number;
  addItem: (item: CartItem, restaurantId: string) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      totalItems: 0,
      totalPaise: 0,

      addItem: (item, restaurantId) => {
        set((state) => {
          if (state.restaurantId && state.restaurantId !== restaurantId) {
            return { items: [item], restaurantId, totalItems: item.qty, totalPaise: item.price_paise * item.qty };
          }
          const existing = state.items.find(i => i.id === item.id);
          const items = existing
            ? state.items.map(i => i.id === item.id ? { ...i, qty: i.qty + item.qty } : i)
            : [...state.items, item];
          const totalItems = items.reduce((acc, i) => acc + i.qty, 0);
          const totalPaise = items.reduce((acc, i) => acc + i.price_paise * i.qty, 0);
          return { items, restaurantId, totalItems, totalPaise };
        });
      },

      updateQty: (id, qty) => {
        set((state) => {
          const items = qty <= 0
            ? state.items.filter(i => i.id !== id)
            : state.items.map(i => i.id === id ? { ...i, qty } : i);
          return {
            items,
            totalItems: items.reduce((acc, i) => acc + i.qty, 0),
            totalPaise: items.reduce((acc, i) => acc + i.price_paise * i.qty, 0),
          };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const items = state.items.filter(i => i.id !== id);
          return {
            items,
            totalItems: items.reduce((acc, i) => acc + i.qty, 0),
            totalPaise: items.reduce((acc, i) => acc + i.price_paise * i.qty, 0),
          };
        });
      },

      clear: () => set({ items: [], restaurantId: null, totalItems: 0, totalPaise: 0 }),
    }),
    { name: 'dine-cart' }
  )
);
