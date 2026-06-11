import { z } from 'zod';

export const createRestaurantSchema = z.object({
  org_name: z.string().min(1, 'Organization name is required'),
  name: z.string().min(1, 'Restaurant name is required'),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  owner_email: z.string().email('Valid email required'),
  owner_phone: z.string().optional(),
  gstin: z.string().optional(),
  fssai_no: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  plan_code: z.enum(['mvp', 'operations', 'ai', 'enterprise']).default('mvp'),
  trial_days: z.number().int().min(0).max(90).default(14),
});

export const createBranchSchema = z.object({
  restaurant_id: z.string().uuid(),
  name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export const createMembershipSchema = z.object({
  user_id: z.string().uuid(),
  restaurant_id: z.string().uuid(),
  branch_id: z.string().uuid().optional(),
  role: z.enum(['owner', 'manager', 'cashier', 'waiter', 'chef', 'customer']),
});
