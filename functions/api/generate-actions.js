function fallbackCandidates(input){
  const typeLabel = input?.step0?.typeLabel || '門店主型';
  const q5 = input?.step0?.q5Type || input?.step0?.answers?.q5?.primary || 'B';
  const typeNames = {A:'商業辦公型',B:'社區住宅型',C:'學生學區型',D:'交通高人流型',E:'休閒觀光／商場型'};
  const groups = input?.priority?.sorted || [];
  const topCustomer = groups[0]?.name || '優先顧客';
  const base = [
    {customer:topCustomer,name:`${typeNames[q5]||typeLabel}小規模測試方案`,reason:`依據 Step 0 判讀，本店較接近「${typeLabel}」，並以客群優先判斷中分數較高的顧客為主。`,need:'回應顧客對方便、清楚、可快速決策的需求。',resource:'運用門店現有產品、預購外帶機制、總部促銷素材與門店人員執行能力。',constraint:'先避開尖峰壓力，避免活動規則過度複雜。',test:'先選一個時段、少量名額或單一合作點進行 1 週測試。',metric:'觀察來客數、預購數、客單、回訪與活動詢問量。'},
    {customer:'既有回訪客',name:'熟客回訪加值行動',reason:'若門店已有熟客或固定取餐顧客，可用低成本方式先提高回訪與客單。',need:'讓熟客有新的回來理由，並降低再次購買的決策成本。',resource:'運用熟客關係、門店公告、會員優惠與分享餐組合。',constraint:'避免增加櫃台說明負擔，活動規則需簡單。',test:'先針對 20～30 位熟客或單一時段試行。',metric:'回訪率、加購率、客單價與優惠使用數。'},
    {customer:'組織／團體客',name:'團體預購接觸行動',reason:'若績效貢獻度高但接觸性不足，可先建立可接觸窗口，而不是直接辦大型活動。',need:'回應團體顧客對準時、好分配、好決策的需求。',resource:'運用品牌信任、套餐組合、預購流程與總部行銷素材。',constraint:'需要建立窗口，並確保大量訂單不干擾尖峰。',test:'先拜訪或接觸 3 個單位，測試一個小型預購方案。',metric:'有效窗口數、詢價數、預購數與訂單金額。'}
  ];
  return base;
}
function extractOutputText(j){
  if(j.output_text) return j.output_text;
  try{return (j.output||[]).flatMap(o=>(o.content||[]).map(c=>c.text||c.output_text||'')).join('\n');}catch(e){return '';}
}
function tryParseJson(text){
  try{return JSON.parse(text);}catch(e){}
  const m = String(text||'').match(/\{[\s\S]*\}/);
  if(m){try{return JSON.parse(m[0]);}catch(e){}}
  return null;
}
export async function onRequestPost(context){
  const {request, env} = context;
  const input = await request.json();
  if(!env.OPENAI_API_KEY){
    return Response.json({ok:true,source:'fallback',candidates:fallbackCandidates(input)});
  }
  const prompt = `你是台灣連鎖餐飲商圈活動設計顧問。請根據使用者提供的 COCA 表單資料，產出 3 到 5 個候選行動方案。不得使用罐頭活動；每個方案必須明確連結 C 顧客需求、O 作戰條件、C 限制與 Step 0 商圈主副型。請只輸出 JSON，格式如下：{"candidates":[{"customer":"主要服務客群","name":"方案名稱","reason":"COC 整合理由","need":"回應需求","resource":"運用條件","constraint":"注意限制","test":"測試方式","metric":"觀察指標"}]}`;
  const body = {
    model: env.OPENAI_MODEL || 'gpt-5-mini',
    input: [
      {role:'developer',content:prompt},
      {role:'user',content:JSON.stringify(input)}
    ],
    store:false
  };
  try{
    const r = await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Authorization':`Bearer ${env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify(body)
    });
    const j = await r.json();
    if(!r.ok) throw new Error(j.error?.message || 'OpenAI API error');
    const text = extractOutputText(j);
    const parsed = tryParseJson(text);
    if(!parsed?.candidates?.length) throw new Error('AI 回傳格式無法解析');
    return Response.json({ok:true,source:'ai',candidates:parsed.candidates.slice(0,5)});
  }catch(e){
    return Response.json({ok:true,source:'fallback',warning:e.message,candidates:fallbackCandidates(input)});
  }
}
