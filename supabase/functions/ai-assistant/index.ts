import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai';

Deno.serve(async (req) => {
  const { question, restaurant_id } = await req.json();
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  const sb = createClient(
    Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Rate limit: 20 AI calls per restaurant per day
  const { count } = await sb.from('ai_reports')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurant_id)
    .gte('created_at', new Date(Date.now() - 86400000).toISOString());
  if ((count ?? 0) >= 20) {
    return new Response(JSON.stringify({ error: 'Daily AI limit reached. Try tomorrow.' }), { status: 429 });
  }

  const { data: metrics } = await sb.rpc('get_restaurant_metrics', {
    p_restaurant_id: restaurant_id,
    p_date: new Date().toISOString().split('T')[0],
  });

  const prompt = `You are the AI business assistant for DineNova, a restaurant management platform.
You are speaking with the restaurant owner. Respond in clear, friendly English.

Restaurant metrics (today):
${JSON.stringify(metrics, null, 2)}

Owner's question: "${question}"

Instructions:
- Be specific about numbers from the metrics
- Give 2-4 bullet points with insights
- Suggest 1 concrete action the owner can take today
- If the question is unrelated to business, politely redirect
- NEVER mention customer names, phone numbers, or any personal information
- Format numbers as ₹ amounts (not paise)`;

  const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  const answer = result.response.text();

  await sb.from('ai_reports').insert({
    restaurant_id, type: 'daily_summary',
    payload: { question, answer, metrics }, model_used: 'gemini-2.5-flash',
  });

  return new Response(JSON.stringify({ answer }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
