import { z } from 'zod';

export const createOrderSchema = z.object({
  restaurant_id: z.string().uuid(),
  branch_id: z.string().uuid(),
  session_id: z.string().uuid().optional(),
  channel: z.enum(['dine_in', 'takeaway', 'own_web', 'swiggy', 'zomato', 'other']).default('dine_in'),
  order_type: z.enum(['dine_in', 'takeaway', 'delivery']).default('dine_in'),
  notes: z.string().max(500).optional(),
});

export const createOrderItemSchema = z.object({
  menu_item_id: z.string().uuid(),
  qty: z.number().int().positive(),
  modifiers: z.array(z.object({
    name: z.string(),
    price_delta_paise: z.number().int(),
  })).default([]),
  notes: z.string().max(200).optional(),
});

export const updateOrderStatusSchema = z.object({
  order_id: z.string().uuid(),
  status: z.enum(['open', 'placed', 'in_kitchen', 'ready', 'served', 'billed', 'paid', 'cancelled']),
  note: z.string().optional(),
});

export const createPaymentSchema = z.object({
  order_id: z.string().uuid().optional(),
  session_id: z.string().uuid().optional(),
  method: z.enum(['upi', 'card', 'cash', 'wallet', 'netbanking', 'aggregator']),
  amount_paise: z.number().int().positive(),
  tip_paise: z.number().int().min(0).default(0),
});
