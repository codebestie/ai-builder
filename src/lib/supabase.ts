import type { Workflow } from '../types';
const KEY='dev-agents:workflows';
const seed:Workflow[]=[{id:'ship-feature',name:'Ship a Feature',description:'Review code, write tests, then plan launch.',public:true,usageCount:42,createdAt:new Date().toISOString(),steps:[{agentId:'code-reviewer'},{agentId:'test-writer'},{agentId:'launch-planner'}]},{id:'secure-api',name:'Secure API Review',description:'Architecture scorecard followed by security and privacy reviews.',public:true,usageCount:27,createdAt:new Date().toISOString(),steps:[{agentId:'api-architect'},{agentId:'security-auditor'},{agentId:'privacy-reviewer'}]}];
function read(){ try{return JSON.parse(localStorage.getItem(KEY)||'null')||seed}catch{return seed} }
function write(items:Workflow[]){ localStorage.setItem(KEY,JSON.stringify(items)); window.dispatchEvent(new CustomEvent('workflow-usage')); }
export const workflowStore={ async list(){return read() as Workflow[]}, async save(w:Workflow){const items=read().filter((x:Workflow)=>x.id!==w.id); items.unshift(w); write(items); return w}, async increment(id:string){const items=read().map((w:Workflow)=>w.id===id?{...w,usageCount:w.usageCount+1}:w); write(items)}, channel(){return{on(){return this},subscribe(cb?:()=>void){cb?.(); return this},unsubscribe(){}}} };
export function shareUrl(id:string){ return `${location.origin}/workflows/${id}/run`; }
