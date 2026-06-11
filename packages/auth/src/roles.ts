export const ROLES = [
  'super_admin',
  'owner',
  'manager',
  'cashier',
  'waiter',
  'chef',
  'customer',
] as const;

export type Role = typeof ROLES[number];
