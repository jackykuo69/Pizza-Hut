function safe(v){ return v == null ? '' : String(v); }
function fallbackCandidates(input){
  const typeLabel = input?.step0?.typeLabel || '門店主型';
  const topCustomer = input?.step1?.priority?.recommended || input?.step1?.customers?.[0]?.name || '優先顧客';
  const goals = (input?.step2?.goals || []).map(x=>x.text).join('、') || '本次經營目標';
  const strengths = (input?.step2?.strengths || []).slice(0,6).map(x=>x.text).join('、') || '門店既有條件';
  const limits = (input?.step3?.keyLimits || []).map(x=>x.text).join('、') || '現場限制';
  const directions = (input?.step3?.directions || []).join('、') || '小範圍測試與簡化規則';
  return [
    {customer:topCustomer,name:'優先客群回訪加值行動',reason:`依據 Step 0「${typeLabel}」與客群優先判斷，先針對最有機會形成績效貢獻的顧客設計回訪誘因。`,need:'回應顧客方便、清楚、降低再次購買決策成本的需求。',resource:`運用 ${strengths}，並結合 ${goals}。`,constraint:`需注意 ${limits}，避免活動增加現場負擔。`,test:'先選定一個低壓力時段，針對少量熟客或會員進行一週試行。',metric:'觀察回訪率、加購率、客單價、優惠使用數與活動詢問量。'},
    {customer:topCustomer,name:'預購快取導流行動',reason:'若顧客重視便利與準時，且門店需要避開尖峰壓力，可將活動設計成預購、快取與集中取餐。',need:'回應快速取餐、準時、減少等待與方便決策的需求。',resource:'運用既有預購、外帶、外送與套餐組合機制。',constraint:`配合處理方向：${directions}。`,test:'先用單一時段或單一客群測試預購快取流程。',metric:'觀察預購數、取餐準時率、等候時間與顧客回饋。'},
    {customer:'商圈機會客',name:'新客第一次嘗試引導行動',reason:'若門店希望開發新客，可用低門檻組合與清楚活動規則，降低第一次購買阻力。',need:'回應新客對價格、便利、品質與決策簡單的需求。',resource:'運用品嘗、套餐、門店公告、社群或總部素材。',constraint:'避免規則複雜，並避免干擾尖峰出餐。',test:'先在一個時段或一個合作點測試少量名額。',metric:'觀察新客數、首次購買數、優惠使用數與回訪轉換。'},
    {customer:'組織／團體客',name:'團體預購窗口開發行動',reason:'若團體客具績效潛力但目前接觸性不足，先建立窗口比直接辦大型活動更可行。',need:'回應團體顧客準時、好分配、好決策與大量供餐的需求。',resource:'運用品牌信任、套餐組合、預購流程與總部行銷素材。',constraint:'需確認窗口、下單流程與大量訂單不干擾尖峰。',test:'先接觸 3 個單位或窗口，測試一個小型預購方案。',metric:'觀察有效窗口數、詢價數、預購數與訂單金額。'},
    {customer:topCustomer,name:'合作場域接觸行動',reason:'若顧客不容易自然想到門店，可透過社區、學校、公司或鄰近商家等接觸點把活動帶到顧客原本所在場域。',need:'回應顧客不想特地繞路、但願意在原本場域接觸或購買的需求。',resource:'運用商圈可用條件、合作場域與簡單套餐。',constraint:'需降低合作協調成本，先避免多點同步執行。',test:'先選一個合作點與一個活動時段試行。',metric:'觀察合作點回應、詢問數、訂單數與後續合作意願。'}
  ];
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
function normalizeCandidates(items){
  return (items||[]).map(x=>({
    customer:safe(x.customer),
    name:safe(x.name).replace(/小規模測試方案|測試方案|試行方案/g,'行動').trim(),
    reason:safe(x.reason),
    need:safe(x.need),
    resource:safe(x.resource),
    constraint:safe(x.constraint),
    test:safe(x.test),
    metric:safe(x.metric)
  })).filter(x=>x.name).slice(0,6);
}
export async function onRequestPost(context){
  const {request, env} = context;
  const input = await request.json();
  if(!env.OPENAI_API_KEY){
    return Response.json({ok:true,source:'fallback',candidates:fallbackCandidates(input)});
  }
  const prompt = `你是台灣連鎖餐飲商圈活動設計顧問。請根據使用者提供的 COCA 表單資料，產出 3 到 6 個候選行動方案。候選方案必須根據本次資料整合生成，不得只用罐頭活動。每個方案必須明確連結：Step 0 商圈主副型、C 顧客需求、O 作戰條件、C 限制與處理方向。方案名稱必須是正式行動名稱，不得使用「小規模測試方案」「測試方案」「試行方案」作為名稱；測試方式只能放在 test 欄位。請只輸出 JSON，格式如下：{"candidates":[{"customer":"主要服務客群","name":"方案名稱","reason":"COCA 整合理由","need":"回應需求","resource":"運用條件","constraint":"注意限制","test":"測試方式","metric":"觀察指標"}]}`;
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
    const candidates = normalizeCandidates(parsed?.candidates);
    if(!candidates.length) throw new Error('AI 回傳格式無法解析');
    return Response.json({ok:true,source:'ai',candidates});
  }catch(e){
    return Response.json({ok:true,source:'fallback',warning:e.message,candidates:fallbackCandidates(input)});
  }
}
