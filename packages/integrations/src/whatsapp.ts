export async function sendUtilityMessage({ to, template, params }: {
  to: string;
  template: string;
  params: string[];
}) {
  return _sendTemplate(to, template, params);
}

export async function sendMarketingMessage({ to, template, params, restaurantId, customerId, supabase }: {
  to: string;
  template: string;
  params: string[];
  restaurantId: string;
  customerId: string;
  supabase: { from: (table: string) => { select: (cols: string) => { eq: (col: string, val: string) => { single: () => Promise<{ data: { consent_marketing: boolean } | null }> } } } };
}) {
  const { data: customer } = await supabase.from('customers').select('consent_marketing').eq('id', customerId).single();
  if (!customer?.consent_marketing) throw new Error('Customer has not consented to marketing messages');
  return _sendTemplate(to, template, params);
}

async function _sendTemplate(to: string, template: string, params: string[]) {
  const res = await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: template,
        language: { code: 'en' },
        components: [{ type: 'body', parameters: params.map(text => ({ type: 'text', text })) }],
      },
    }),
  });
  return res.json();
}
