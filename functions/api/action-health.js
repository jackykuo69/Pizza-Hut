export async function onRequestGet(context){
  const { env } = context;
  return new Response(JSON.stringify({
    ok: true,
    has_openai_key: Boolean(env.OPENAI_API_KEY),
    model: env.OPENAI_MODEL || 'gpt-5-mini',
    allow_rule_fallback: env.ALLOW_RULE_FALLBACK === 'true'
  }), { headers: { 'content-type': 'application/json; charset=utf-8' } });
}
