import type { Provider } from '../types';
export const RECENTS_KEY='dev-agents:recents'; export const FAV_KEY='dev-agents:favorites'; export const THEME_KEY='dev-agents:theme';
export function readJson<T>(key:string, fallback:T, store:Storage=localStorage):T{ try{return JSON.parse(store.getItem(key)||'') as T}catch{return fallback} }
export function writeJson<T>(key:string, value:T, store:Storage=localStorage){ store.setItem(key, JSON.stringify(value)); }
export function addRecent(id:string){ const next=[id,...readJson<string[]>(RECENTS_KEY,[]).filter(x=>x!==id)].slice(0,5); writeJson(RECENTS_KEY,next); }
export function saveSessionKey(provider:Provider,key:string){ if(key) sessionStorage.setItem(`dev-agents:key:${provider}`,key); }
export function getSessionKey(provider:Provider){ return sessionStorage.getItem(`dev-agents:key:${provider}`)||''; }
