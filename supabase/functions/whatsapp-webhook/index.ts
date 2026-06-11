import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

async function verifyHubSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const hex = 'sha256=' + Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hex === signature;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // GET: verify webhook
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    if (mode === 'subscribe' && token === Deno.env.get('WHATSAPP_WEBHOOK_VERIFY_TOKEN')) {
      return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
  }

  // POST: process webhook
  const body = await req.text();
  const sig = req.headers.get('x-hub-signature-256') ?? '';
  const ok = await verifyHubSignature(body, sig, Deno.env.get('WHATSAPP_APP_SECRET')!);
  if (!ok) return new Response('Invalid signature', { status: 401 });

  const event = JSON.parse(body);
  const idemKey = `whatsapp:${JSON.stringify(event).slice(0, 100)}`;

  const sb = createClient(
    Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    await sb.from('webhook_events').insert({
      source: 'whatsapp', event_type: 'status', idempotency_key: idemKey, payload: event,
    });
  } catch {
    return new Response('Already processed', { status: 200 });
  }

  await sb.from('webhook_events').update({ processed: true, processed_at: new Date().toISOString() })
    .eq('idempotency_key', idemKey);

  return new Response('OK', { status: 200 });
});
