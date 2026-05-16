import type { LlmMessage, Provider } from '../types';
export const providerModels: Record<Provider,string[]> = { openai:['gpt-4.1-mini','gpt-4.1','gpt-4o-mini'], anthropic:['claude-3-5-sonnet-latest','claude-3-5-haiku-latest'], gemini:['gemini-1.5-flash','gemini-1.5-pro'] };
export type RunArgs={provider:Provider;model:string;apiKey:string;messages:LlmMessage[];signal?:AbortSignal;onToken?:(token:string)=>void;stream?:boolean};
const join=(messages:LlmMessage[])=>messages.map(m=>`${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
export async function runLlm({provider,model,apiKey,messages,signal,onToken,stream}:RunArgs):Promise<string>{
 if(apiKey.trim().toLowerCase().startsWith('mock')) return mockRun(provider,messages,onToken,signal);
 if(provider==='openai') return openai(model,apiKey,messages,signal,onToken,stream);
 if(provider==='anthropic') return anthropic(model,apiKey,messages,signal,onToken,stream);
 return gemini(model,apiKey,messages,signal,onToken,stream);
}
async function openai(model:string,apiKey:string,messages:LlmMessage[],signal?:AbortSignal,onToken?:(t:string)=>void,stream=false){
 const res=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',signal,headers:{'Content-Type':'application/json',Authorization:`Bearer ${apiKey}`},body:JSON.stringify({model,messages,stream})});
 if(!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`); if(stream&&res.body&&onToken) return parseSse(res.body,onToken,(j)=>j.choices?.[0]?.delta?.content||'');
 const j=await res.json(); return j.choices?.[0]?.message?.content||'';
}
async function anthropic(model:string,apiKey:string,messages:LlmMessage[],signal?:AbortSignal,onToken?:(t:string)=>void,stream=false){
 const system=messages.find(m=>m.role==='system')?.content||''; const rest=messages.filter(m=>m.role!=='system').map(m=>({role:m.role==='assistant'?'assistant':'user',content:m.content}));
 const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',signal,headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model,system,messages:rest,max_tokens:2048,stream})});
 if(!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`); if(stream&&res.body&&onToken) return parseSse(res.body,onToken,(j)=>j.type==='content_block_delta'?j.delta?.text||'':'');
 const j=await res.json(); return j.content?.map((c:any)=>c.text||'').join('')||'';
}
async function gemini(model:string,apiKey:string,messages:LlmMessage[],signal?:AbortSignal,onToken?:(t:string)=>void,stream=false){
 const base=`https://generativelanguage.googleapis.com/v1beta/models/${model}:${stream?'streamGenerateContent':'generateContent'}?key=${apiKey}${stream?'&alt=sse':''}`;
 const system=messages.find(m=>m.role==='system')?.content; const contents=messages.filter(m=>m.role!=='system').map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]}));
 const res=await fetch(base,{method:'POST',signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({systemInstruction:system?{parts:[{text:system}]}:undefined,contents})});
 if(!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`); if(stream&&res.body&&onToken) return parseSse(res.body,onToken,(j)=>j.candidates?.[0]?.content?.parts?.[0]?.text||'');
 const j=await res.json(); return j.candidates?.[0]?.content?.parts?.map((p:any)=>p.text||'').join('')||'';
}
async function parseSse(body:ReadableStream<Uint8Array>,onToken:(t:string)=>void,pick:(j:any)=>string){ const reader=body.getReader(); const dec=new TextDecoder(); let buf='',out=''; while(true){ const {done,value}=await reader.read(); if(done)break; buf+=dec.decode(value,{stream:true}); const lines=buf.split('\n'); buf=lines.pop()||''; for(const line of lines){ if(!line.startsWith('data:'))continue; const data=line.slice(5).trim(); if(!data||data==='[DONE]')continue; try{const t=pick(JSON.parse(data)); if(t){out+=t; onToken(t)}}catch{}} } return out; }
async function mockRun(provider:Provider,messages:LlmMessage[],onToken?:(t:string)=>void,signal?:AbortSignal){ const text=`# ${provider} mock response\n\n${join(messages).slice(0,500)}\n\n- Validated inputs\n- Generated safely in browser\n- No key left this session`; let out=''; for(const word of text.split(' ')){ if(signal?.aborted) throw new DOMException('Aborted','AbortError'); const t=word+' '; out+=t; onToken?.(t); await new Promise(r=>setTimeout(r,8)); } return out; }
