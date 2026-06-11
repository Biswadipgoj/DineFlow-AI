import { z } from 'zod';

export const createMenuCategorySchema = z.object({
  restaurant_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  image_url: z.string().url().optional(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const createMenuItemSchema = z.object({
  restaurant_id: z.string().uuid(),
  category_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price_paise: z.number().int().positive('Price must be positive'),
  is_veg: z.boolean().nullable(),
  hsn_sac: z.string().optional(),
  gst_rate: z.number().refine(v => [0, 5, 12, 18, 28].includes(v), 'Invalid GST rate'),
  is_available: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const updateMenuItemSchema = createMenuItemSchema.partial().omit({ restaurant_id: true });
