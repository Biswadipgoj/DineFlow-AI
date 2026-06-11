import type { SupabaseClient } from '@supabase/supabase-js';

export type Feature =
  | 'inventory' | 'suppliers' | 'staff_management' | 'expenses'
  | 'ai_assistant' | 'ai_forecast' | 'menu_engineering' | 'anomaly_detection'
  | 'whatsapp_marketing' | 'loyalty' | 'multi_branch' | 'franchise' | 'aggregator_integration';

export async function can(sb: SupabaseClient, restaurant_id: string, feature: Feature): Promise<boolean> {
  const { data } = await sb
    .from('subscriptions')
    .select('plans(features), status, trial_end')
    .eq('restaurant_id', restaurant_id)
    .in('status', ['active', 'trialing'])
    .single();

  if (!data) return false;
  if (data.status === 'trialing' && data.trial_end && new Date(data.trial_end) < new Date()) return false;
  return (data.plans as { features?: Record<string, boolean> } | null)?.features?.[feature] === true;
}
