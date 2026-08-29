const REQUIRED_FIELDS = ['customer','name','reason','need','resource','constraint','test','metric'];
const BANNED_NAME_PATTERNS = [
  /小規模測試方案/g,
  /測試方案/g,
  /試行方案/g,
  /優先客群回訪加值行動/g,
  /預購快取導流行動/g,
  /新客第一次嘗試引導行動/g,
  /團體預購窗口開發行動/g,
  /合作場域接觸行動/g,
  /社區住宅型小規模/g,
  /罐頭/g
];

function safe(v){ return v == null ? '' : String(v); }
function asArray(v){ return Array.isArray(v) ? v : []; }
function pickText(x){ return typeof x === 'string' ? x : safe(x?.text || x?.name || x?.label || ''); }
function compactJoin(items, max=10){ return asArray(items).map(pickText).filter(Boolean).slice(0,max).join('、'); }
function responseJson(obj, status=200){ return new Response(JSON.stringify(obj), {status, headers:{'content-type':'application/json; charset=utf-8'}}); }

function buildBrief(input){
  const s0 = input?.step0 || {};
  const s1 = input?.step1 || {};
  const s2 = input?.step2 || {};
  const s3 = input?.step3 || {};
  const priority = s1?.priority?.recommended || '';
  const customers = asArray(s1?.customers).map(c=>({
    name: safe(c.name),
    contexts: asArray(c.contexts).map(safe),
    pains: asArray(c.pains).map(safe),
    reasons: asArray(c.reasons).map(safe),
    note: safe(c.note)
  })).filter(c=>c.name);
  return {
    store: { group_name:safe(input?.group_name), store_name:safe(input?.store_name) },
    step0: {
      district:safe(s0.typeLabel),
      main_type:safe(s0.main),
      sub_type:safe(s0.sub),
      visible_environment:asArray(s0.envLabels).map(safe),
      most_influential_environment:asArray(s0.topLabels).map(safe),
      busy_time:[s0.q2?.primaryLabel, s0.q2?.secondaryLabel].filter(Boolean).map(safe),
      purchase_task:[s0.q3?.primaryLabel, s0.q3?.secondaryLabel].filter(Boolean).map(safe),
      customer_type:[s0.q4?.primaryLabel, s0.q4?.secondaryLabel].filter(Boolean).map(safe),
      business_goal:safe(s0.q5?.label)
    },
    step1: { priority_customer: safe(priority), customers },
    step2: {
      gm_expectations: asArray(s2.goals).map(x=>({category:safe(x.category), text:pickText(x)})),
      strengths: asArray(s2.strengths).map(x=>({category:safe(x.category), text:pickText(x)})),
      limits: asArray(s2.limits).map(x=>({category:safe(x.category), text:pickText(x)}))
    },
    step3: {
      key_limits: asArray(s3.keyLimits).map(x=>({category:safe(x.category), text:pickText(x)})),
      impacts: asArray(s3.impacts).map(safe),
      design_adjustments: asArray(s3.directions).map(safe)
    }
  };
}

function importantTerms(brief){
  const terms = [];
  const push = v => { if(v) String(v).split(/[、，,／/\s]+/).forEach(t=>{ if(t && t.length>=2) terms.push(t); }); };
  push(brief.step0.district);
  brief.step0.most_influential_environment.forEach(push);
  brief.step0.busy_time.forEach(push);
  brief.step0.purchase_task.forEach(push);
  brief.step0.customer_type.forEach(push);
  push(brief.step0.business_goal);
  push(brief.step1.priority_customer);
  brief.step1.customers.forEach(c=>{push(c.name); c.pains.forEach(push); c.contexts.forEach(push); c.reasons.forEach(push);});
  brief.step2.strengths.forEach(x=>push(x.text));
  brief.step2.gm_expectations.forEach(x=>push(x.text));
  brief.step3.key_limits.forEach(x=>push(x.text));
  brief.step3.design_adjustments.forEach(push);
  return [...new Set(terms)].filter(t=>!['顧客','活動','門店','方案','商圈','需求','痛點','方式','經營','行動'].includes(t)).slice(0,80);
}

function candidateSchema(){
  return {
    type:'object', additionalProperties:false,
    properties:{
      candidates:{
        type:'array', minItems:3, maxItems:6,
        items:{ type:'object', additionalProperties:false, properties:{
          customer:{type:'string'},
          name:{type:'string'},
          reason:{type:'string'},
          need:{type:'string'},
          resource:{type:'string'},
          constraint:{type:'string'},
          test:{type:'string'},
          metric:{type:'string'},
          evidence_tags:{type:'array', items:{type:'string'}, minItems:3, maxItems:8}
        }, required:['customer','name','reason','need','resource','constraint','test','metric','evidence_tags'] }
      }
    }, required:['candidates']
  };
}

function buildPrompt(brief, revisionNote=''){
  return `你是台灣連鎖餐飲門店的商圈活動設計顧問，任務是根據 COCA 表單資料，設計「候選行動方向」。

重要要求：
1. 必須根據本次輸入資料生成，不得輸出罐頭方案。
2. 每個方案至少要明確使用 3 個本次資料中的具體線索，例如：最影響生意環境、忙碌時段、購買任務、主要顧客、需求痛點、可用優勢、關鍵限制、避開限制做法。
3. 方案名稱要像正式行動名稱，不得使用「小規模測試方案」「測試方案」「試行方案」，也不得用「優先客群回訪加值行動」「預購快取導流行動」這種通用模板名稱。
4. 候選方案要有差異，不要只是把同一件事換字說。請至少涵蓋不同角度，例如：回訪、預購快取、團訂／組織客、合作場域、現場轉換、外送或集中取餐等；但只選擇與本資料吻合的角度。
5. 不要假設門店有內用座位。若空間或尖峰壓力有限，方案必須避開增加現場負擔。
6. 每個方案需寫成可被店總經理理解的白話中文，不要使用過度顧問語。
7. 「測試方式」只能描述如何先試做，不可以出現在方案名稱。
8. 只輸出 JSON，不要 Markdown，不要額外解釋。

候選方案欄位定義：
- customer：主要服務客群。
- name：正式方案名稱，10～18 個中文字為宜。
- reason：COCA 整合理由，必須點出 Step 0 / Step 1 / Step 2 / Step 3 至少三個線索。
- need：回應哪一個顧客需求或痛點。
- resource：運用哪些可用條件或既有做法。
- constraint：要注意哪些限制，以及如何避免踩雷。
- test：可如何先試做。
- metric：觀察指標，必須是可觀察的數字或現象。
- evidence_tags：列出本方案實際用到的 3～8 個輸入線索。
${revisionNote ? `\n修正要求：${revisionNote}\n` : ''}`;
}

async function callOpenAI(env, prompt, brief){
  const body = {
    model: env.OPENAI_MODEL || 'gpt-5-mini',
    input: [
      {role:'developer', content: prompt},
      {role:'user', content: JSON.stringify(brief)}
    ],
    text: { format: { type:'json_schema', name:'coca_action_candidates', schema:candidateSchema(), strict:true } },
    store:false
  };
  const r = await fetch('https://api.openai.com/v1/responses', {
    method:'POST',
    headers:{'Authorization':`Bearer ${env.OPENAI_API_KEY}`, 'Content-Type':'application/json'},
    body:JSON.stringify(body)
  });
  const j = await r.json();
  if(!r.ok) throw new Error(j?.error?.message || 'OpenAI API error');
  const text = j.output_text || (j.output||[]).flatMap(o=>(o.content||[]).map(c=>c.text||'')).join('\n');
  try { return JSON.parse(text); }
  catch(e){ throw new Error('AI 回傳格式無法解析'); }
}

function cleanName(name){
  let n = safe(name).trim();
  BANNED_NAME_PATTERNS.forEach(p=>{ n = n.replace(p,'').trim(); });
  n = n.replace(/\s+/g,'');
  return n;
}
function normalizeCandidates(items){
  const seen = new Set();
  return asArray(items).map(x=>{
    const item = {};
    REQUIRED_FIELDS.forEach(k=>item[k]=safe(x?.[k]).trim());
    item.name = cleanName(item.name);
    item.evidence_tags = asArray(x?.evidence_tags).map(safe).filter(Boolean).slice(0,8);
    return item;
  }).filter(x=>{
    if(!x.name || seen.has(x.name)) return false;
    seen.add(x.name);
    return REQUIRED_FIELDS.every(k=>x[k]);
  }).slice(0,6);
}
function qualityCheck(candidates, brief){
  const terms = importantTerms(brief);
  const problems = [];
  if(candidates.length < 3) problems.push('候選方案少於 3 個');
  candidates.forEach((c, i)=>{
    if(BANNED_NAME_PATTERNS.some(p=>p.test(c.name))) problems.push(`第 ${i+1} 個方案名稱太像模板或測試名稱`);
    const allText = `${c.customer} ${c.name} ${c.reason} ${c.need} ${c.resource} ${c.constraint} ${c.test} ${c.metric} ${c.evidence_tags.join(' ')}`;
    const hit = terms.filter(t=>allText.includes(t)).length;
    if(hit < 3) problems.push(`第 ${i+1} 個方案沒有明確連回至少 3 個本次輸入線索`);
    if(c.evidence_tags.length < 3) problems.push(`第 ${i+1} 個方案 evidence_tags 不足`);
  });
  const names = candidates.map(c=>c.name);
  if(new Set(names).size !== names.length) problems.push('方案名稱重複');
  return problems;
}

function contextualFallback(brief){
  const customer = brief.step1.priority_customer || brief.step0.customer_type[0] || '主要顧客';
  const env = brief.step0.most_influential_environment.join('、') || brief.step0.visible_environment.slice(0,3).join('、') || '周邊商圈';
  const task = brief.step0.purchase_task.join('、') || '購買任務';
  const goal = brief.step0.business_goal || '本次經營目標';
  const pain = brief.step1.customers.find(c=>c.name===customer)?.pains?.slice(0,2).join('、') || brief.step1.customers[0]?.pains?.slice(0,2).join('、') || '顧客需求';
  const strength = brief.step2.strengths.slice(0,3).map(x=>x.text).join('、') || '既有資源';
  const limit = brief.step3.key_limits.slice(0,2).map(x=>x.text).join('、') || '現場限制';
  const adjust = brief.step3.design_adjustments.slice(0,2).join('、') || '降低現場負擔';
  return [{
    customer,
    name:`${customer.replace(/／.*/,'')}情境預購行動`,
    reason:`依據 ${env}、${task} 與本次目標「${goal}」，先鎖定 ${customer} 的明確需求，並避開 ${limit}。`,
    need:`回應 ${pain}。`,
    resource:`運用 ${strength}。`,
    constraint:`注意 ${limit}，活動設計需採取 ${adjust}。`,
    test:'先選一個低壓力時段與一個明確顧客來源試做。',
    metric:'觀察預購數、回訪數、詢問數、客單價與現場等待時間。',
    evidence_tags:[env, task, goal, customer, pain, strength, limit].filter(Boolean).slice(0,8)
  }];
}

export async function onRequestPost(context){
  const {request, env} = context;
  let input;
  try { input = await request.json(); }
  catch(e){ return responseJson({ok:false, error:'請求資料格式錯誤'}, 400); }
  const brief = buildBrief(input);
  if(!brief.step0.district || !brief.step1.priority_customer){
    return responseJson({ok:false, error:'COCA 資料不足，請先完成 Step 0～Step 3。'}, 400);
  }
  if(!env.OPENAI_API_KEY){
    if(env.ALLOW_RULE_FALLBACK === 'true'){
      return responseJson({ok:true, source:'fallback', warning:'OPENAI_API_KEY 尚未設定，目前僅回傳一筆臨時備援方案。', candidates:contextualFallback(brief)});
    }
    return responseJson({ok:false, error:'AI 候選方案 API 尚未設定 OPENAI_API_KEY，無法產生真正的候選行動方案。'}, 503);
  }
  try{
    let parsed = await callOpenAI(env, buildPrompt(brief), brief);
    let candidates = normalizeCandidates(parsed?.candidates);
    let problems = qualityCheck(candidates, brief);
    if(problems.length){
      const revisionNote = `${problems.join('；')}。請重新產生 3～6 個更貼近本次資料、彼此差異更大的候選方案。`;
      parsed = await callOpenAI(env, buildPrompt(brief, revisionNote), brief);
      candidates = normalizeCandidates(parsed?.candidates);
      problems = qualityCheck(candidates, brief);
    }
    if(candidates.length < 3) throw new Error('AI 產出的可用候選方案不足 3 個');
    return responseJson({ok:true, source:'ai', candidates, quality_warnings:problems});
  }catch(e){
    if(env.ALLOW_RULE_FALLBACK === 'true'){
      return responseJson({ok:true, source:'fallback', warning:e.message, candidates:contextualFallback(brief)});
    }
    return responseJson({ok:false, error:`AI 候選方案產生失敗：${e.message}`}, 500);
  }
}
