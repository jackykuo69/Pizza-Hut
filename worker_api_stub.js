// Cloudflare Worker / Pages Function API Stub
// OpenAI API Key 應設為環境變數：OPENAI_API_KEY

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const input = await request.json();

    return Response.json({
      ok: true,
      message: "API stub only. Implement OpenAI API call here.",
      input
    });

  } catch (error) {
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
