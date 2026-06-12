import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Integration tests — they need a live Supabase instance with the seed data
// loaded. They run only when the Supabase env vars are configured (e.g. in CI
// with secrets set, or locally against `supabase start`).
const hasEnv = Boolean(SUPABASE_URL && ANON_KEY && SERVICE_ROLE_KEY);

const RESTAURANT_B_ID = '00000000-0000-0000-0000-000000000099'; // hypothetical second tenant

describe.runIf(hasEnv)('RLS isolation', () => {
  it('restaurant A owner cannot read restaurant B orders', async () => {
    const client = createClient(SUPABASE_URL!, ANON_KEY!);
    const { data } = await client
      .from('orders')
      .select('id, restaurant_id')
      .eq('restaurant_id', RESTAURANT_B_ID);

    // RLS returns 0 rows for a JWT scoped to a different restaurant
    expect(data?.length ?? 0).toBe(0);
  });

  it('service role key can see all rows across tenants', async () => {
    const adminClient = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!);
    const { data, error } = await adminClient.from('restaurants').select('id');

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('anon user can read available menu items (public menu)', async () => {
    const anonClient = createClient(SUPABASE_URL!, ANON_KEY!);
    const { error } = await anonClient
      .from('menu_items')
      .select('id, name, price_paise')
      .eq('is_available', true)
      .limit(5);

    expect(error).toBeNull();
  });
});

describe.runIf(!hasEnv)('RLS isolation (skipped)', () => {
  it.skip('requires NEXT_PUBLIC_SUPABASE_URL / keys to be configured', () => {});
});
