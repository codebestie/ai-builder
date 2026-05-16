import { Eye, EyeOff, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSessionKey, saveSessionKey } from '../lib/storage';
import { providerModels } from '../lib/llm';
import type { AgentProvider, Provider } from '../types';
const providers:Provider[]=['openai','anthropic','gemini'];
export function ApiKeyBar({fixedProvider,provider,setProvider,model,setModel,onKey}:{fixedProvider:AgentProvider;provider:Provider;setProvider:(p:Provider)=>void;model:string;setModel:(m:string)=>void;onKey:(p:Provider,k:string)=>void}){
 const [show,setShow]=useState(false); const [keys,setKeys]=useState<Record<Provider,string>>({openai:'',anthropic:'',gemini:''}); const locked=fixedProvider!=='any';
 useEffect(()=>{setKeys({openai:getSessionKey('openai'),anthropic:getSessionKey('anthropic'),gemini:getSessionKey('gemini')})},[]);
 useEffect(()=>{onKey(provider,keys[provider]||'')},[provider,keys,onKey]);
 useEffect(()=>{ if(locked){setProvider(fixedProvider as Provider)} },[fixedProvider,locked,setProvider]);
 const models=providerModels[provider];
 return <div className="card p-3 flex flex-col gap-3 lg:flex-row lg:items-center"><div className="flex items-center gap-2 text-sm font-semibold"><Save className="h-4 w-4 text-accent"/> API keys stay in your browser</div><select aria-label="Provider" disabled={locked} value={provider} onChange={e=>{const p=e.target.value as Provider;setProvider(p);setModel(providerModels[p][0])}} className="rounded-xl border border-border bg-input px-3 py-2 disabled:opacity-60">{providers.map(p=><option key={p}>{p}</option>)}</select><select aria-label="Model" value={model} onChange={e=>setModel(e.target.value)} className="rounded-xl border border-border bg-input px-3 py-2">{models.map(m=><option key={m}>{m}</option>)}</select><div className="flex flex-1"><input aria-label="API key" value={keys[provider]||''} onChange={e=>setKeys({...keys,[provider]:e.target.value})} type={show?'text':'password'} placeholder={`Enter ${provider} key or mock-${provider}`} className="min-w-0 flex-1 rounded-l-xl border border-border bg-input px-3 py-2"/><button className="border-y border-border bg-input px-3" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button><button className="rounded-r-xl border border-border bg-hover px-3 text-sm" onClick={()=>saveSessionKey(provider,keys[provider]||'')}>Save for session</button></div></div>
}
