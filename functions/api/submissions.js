export async function onRequestGet(context) {
  const { env } = context;
  if (!env.DB) return Response.json({ ok: false, error: 'D1 binding DB is not configured.' }, { status: 200 });

  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');

  if (id) {
    const item = await env.DB.prepare(
      'SELECT id, group_name, store_name, district_type, district_subtype, current_stage, stage_status, data, updated_at FROM submissions WHERE id = ?'
    ).bind(id).first();
    return Response.json({ ok: true, item });
  }

  const { results } = await env.DB.prepare(
    'SELECT id, group_name, store_name, district_type, district_subtype, current_stage, stage_status, data, updated_at FROM submissions ORDER BY updated_at DESC'
  ).all();
  return Response.json({ ok: true, items: results });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return Response.json({ ok: false, error: 'D1 binding DB is not configured.' }, { status: 200 });
  const input = await request.json();
  const now = new Date().toISOString();
  await env.DB.prepare(`
    INSERT INTO submissions (id, group_name, store_name, district_type, district_subtype, current_stage, stage_status, data, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      group_name=excluded.group_name,
      store_name=excluded.store_name,
      district_type=excluded.district_type,
      district_subtype=excluded.district_subtype,
      current_stage=excluded.current_stage,
      stage_status=excluded.stage_status,
      data=excluded.data,
      updated_at=excluded.updated_at
  `).bind(input.id, input.group_name || '', input.store_name || '', input.district_type || '', input.district_subtype || '', input.current_stage || 0, input.stage_status || '{}', input.data || '{}', now).run();
  return Response.json({ ok: true, updated_at: now });
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  if (!env.DB) return Response.json({ ok: false, error: 'D1 binding DB is not configured.' }, { status: 200 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return Response.json({ ok: false, error: 'Missing id.' }, { status: 400 });
  }

  await env.DB.prepare('DELETE FROM submissions WHERE id = ?').bind(id).run();
  return Response.json({ ok: true, deleted_id: id });
}
