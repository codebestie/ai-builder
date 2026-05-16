import { Bot, Bug, Code2, Database, FileJson, GitBranch, Lock, Rocket, Search, ShieldCheck, Sparkles, TestTube2, Workflow } from 'lucide-react';
import type { Agent } from '../types';
const icons = { Bot, Bug, Code2, Database, FileJson, GitBranch, Lock, Rocket, Search, ShieldCheck, Sparkles, TestTube2, Workflow };
const baseInputs = [{ id:'task', label:'Task or context', type:'textarea' as const, required:true, placeholder:'Describe what you want this agent to do...' }];
export const categoryStyles: Record<string,string> = {
  Code:'from-indigo-500 to-violet-500', Testing:'from-emerald-500 to-teal-500', Security:'from-rose-500 to-orange-500', Data:'from-cyan-500 to-blue-500', Planning:'from-amber-500 to-pink-500'
};
const raw = [
 {id:'code-reviewer',name:'Code Reviewer',description:'Finds correctness, maintainability, and edge-case issues in code changes.',category:'Code',icon:'Code2',provider:'any',model:'gpt-4.1-mini',outputType:'markdown',systemPrompt:'You are a senior code reviewer. Prioritize bugs, risks, and actionable improvements.'},
 {id:'bug-hunter',name:'Bug Hunter',description:'Reproduces likely failures and proposes minimal fixes.',category:'Testing',icon:'Bug',provider:'anthropic',model:'claude-3-5-sonnet-latest',outputType:'markdown',systemPrompt:'You are a meticulous debugging agent. Explain likely root causes and tests.'},
 {id:'test-writer',name:'Test Writer',description:'Designs pragmatic unit, integration, and e2e tests.',category:'Testing',icon:'TestTube2',provider:'any',model:'gemini-1.5-flash',outputType:'markdown',systemPrompt:'You are a testing specialist. Produce concise, runnable test plans and examples.'},
 {id:'api-architect',name:'API Architect',description:'Shapes endpoints, contracts, errors, and versioning.',category:'Planning',icon:'GitBranch',provider:'openai',model:'gpt-4.1-mini',outputType:'json',systemPrompt:'Return a JSON architecture scorecard with strengths, risks, and next_steps arrays.'},
 {id:'security-auditor',name:'Security Auditor',description:'Threat-models browser, API, and data-flow risks.',category:'Security',icon:'ShieldCheck',provider:'any',model:'claude-3-5-haiku-latest',outputType:'markdown',systemPrompt:'You are an application security auditor. Use severity labels and remediation steps.'},
 {id:'sql-optimizer',name:'SQL Optimizer',description:'Improves schema, query plans, indexing, and migrations.',category:'Data',icon:'Database',provider:'gemini',model:'gemini-1.5-pro',outputType:'markdown',systemPrompt:'You are a database performance expert. Explain tradeoffs and safer rollout steps.'},
 {id:'json-shaper',name:'JSON Shaper',description:'Converts messy requirements into typed JSON structures.',category:'Data',icon:'FileJson',provider:'any',model:'gpt-4.1-mini',outputType:'json',systemPrompt:'Return valid JSON only with schema, sample, and validation_notes.'},
 {id:'launch-planner',name:'Launch Planner',description:'Builds release checklists, risks, owners, and comms.',category:'Planning',icon:'Rocket',provider:'any',model:'gpt-4.1-mini',outputType:'markdown',systemPrompt:'You are a launch manager. Produce an ordered checklist with owners and risks.'},
 {id:'prompt-engineer',name:'Prompt Engineer',description:'Turns fuzzy ideas into reliable agent prompts.',category:'Code',icon:'Sparkles',provider:'any',model:'gpt-4.1-mini',outputType:'text',systemPrompt:'You are a prompt engineer. Produce a compact system prompt and user template.'},
 {id:'privacy-reviewer',name:'Privacy Reviewer',description:'Checks key handling, PII, retention, and consent.',category:'Security',icon:'Lock',provider:'any',model:'claude-3-5-sonnet-latest',outputType:'markdown',systemPrompt:'You are a privacy engineer. Highlight data exposure and mitigations.'},
 {id:'research-scout',name:'Research Scout',description:'Synthesizes technical tradeoffs from supplied sources.',category:'Planning',icon:'Search',provider:'any',model:'gemini-1.5-flash',outputType:'markdown',systemPrompt:'You are a research assistant. Only use provided context; separate facts from assumptions.'},
 {id:'workflow-composer',name:'Workflow Composer',description:'Recommends multi-agent sequences up to five steps.',category:'Planning',icon:'Workflow',provider:'any',model:'gpt-4.1-mini',outputType:'json',systemPrompt:'Return JSON with workflow_name, steps, and why_this_order.'}
];
export const agents: Agent[] = raw.map((a)=>({ ...a, inputs:baseInputs, Icon: icons[a.icon as keyof typeof icons] ?? Bot } as Agent));
export const agentsById = Object.fromEntries(agents.map(a=>[a.id,a]));
export const categories = [...new Set(agents.map(a=>a.category))];
