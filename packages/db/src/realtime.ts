import { createClient } from './client';

export function subscribeToKOTs(restaurantId: string, onNew: (payload: unknown) => void) {
  return createClient()
    .channel(`kots:${restaurantId}`)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'kots',
      filter: `restaurant_id=eq.${restaurantId}`,
    }, onNew)
    .subscribe();
}

export function subscribeToOrderItems(orderId: string, onChange: (payload: unknown) => void) {
  return createClient()
    .channel(`order_items:${orderId}`)
    .on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'order_items',
      filter: `order_id=eq.${orderId}`,
    }, onChange)
    .subscribe();
}

export function subscribeToTableSessions(restaurantId: string, onChange: (payload: unknown) => void) {
  return createClient()
    .channel(`sessions:${restaurantId}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'table_sessions',
      filter: `restaurant_id=eq.${restaurantId}`,
    }, onChange)
    .subscribe();
}
