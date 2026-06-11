import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

async function verifyRazorpaySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hex === signature;
}

Deno.serve(async (req) => {
  const body = await req.text();
  const sig  = req.headers.get('x-razorpay-signature') ?? '';
  const ok   = await verifyRazorpaySignature(body, sig, Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!);
  if (!ok) return new Response('Invalid signature', { status: 401 });

  const event = JSON.parse(body);
  const payment = event.payload?.payment?.entity;
  const idemKey = `razorpay:${event.event}:${payment?.id ?? event.payload?.subscription?.entity?.id}`;

  const sb = createClient(
    Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    await sb.from('webhook_events').insert({
      source: 'razorpay', event_type: event.event, idempotency_key: idemKey, payload: event,
    });
  } catch {
    return new Response('Already processed', { status: 200 });
  }

  if (event.event === 'payment.captured') {
    const { data: pmnt } = await sb.from('payments').update({
      status: 'success', signature_verified: true,
      razorpay_payment_id: payment.id, updated_at: new Date().toISOString(),
    }).eq('razorpay_order_id', payment.order_id).select('order_id, session_id, restaurant_id').single();

    if (pmnt?.order_id) {
      await sb.from('orders').update({ status: 'paid', updated_at: new Date().toISOString() }).eq('id', pmnt.order_id);
      await sb.from('order_status_history').insert({
        order_id: pmnt.order_id, from_status: 'billed', to_status: 'paid',
      });
      await sb.rpc('deduct_inventory_for_order', { p_order_id: pmnt.order_id });
    }
    if (pmnt?.session_id) {
      await sb.from('table_sessions').update({
        status: 'settled', closed_at: new Date().toISOString(),
      }).eq('id', pmnt.session_id);
    }
    await sb.from('audit_logs').insert({
      restaurant_id: pmnt?.restaurant_id, action: 'payment.captured',
      entity: 'payments', entity_id: payment.id,
    });
  }

  if (event.event === 'subscription.activated' || event.event === 'subscription.charged') {
    const sub = event.payload.subscription.entity;
    await sb.from('subscriptions').update({
      status: 'active',
      current_period_start: new Date(sub.current_start * 1000).toISOString(),
      current_period_end: new Date(sub.current_end * 1000).toISOString(),
    }).eq('razorpay_subscription_id', sub.id);
  }

  if (event.event === 'subscription.halted') {
    await sb.from('subscriptions').update({ status: 'past_due' })
      .eq('razorpay_subscription_id', event.payload.subscription.entity.id);
  }

  await sb.from('webhook_events').update({ processed: true, processed_at: new Date().toISOString() })
    .eq('idempotency_key', idemKey);

  return new Response('OK', { status: 200 });
});
