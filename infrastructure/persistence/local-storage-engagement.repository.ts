import { DEFAULT_ENGAGEMENT_STATE, EngagementRepository, EngagementState } from '@/application/ports/engagement.repository';
export const ENGAGEMENT_STORAGE_KEY = 'focus-beat-engagement';
export function isLocalDate(value: unknown): value is string { if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const [y,m,d]=value.split('-').map(Number); const date=new Date(y,m-1,d); return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d; }
export class LocalStorageEngagementRepository implements EngagementRepository {
  constructor(private readonly storage: Storage) {}
  load(): EngagementState { const raw=this.storage.getItem(ENGAGEMENT_STORAGE_KEY); if (!raw) return { ...DEFAULT_ENGAGEMENT_STATE }; try { const v=JSON.parse(raw); if (v?.version!==1 || (v.lastFocusCompletionDate!==null&&!isLocalDate(v.lastFocusCompletionDate)) || (v.lastFeedbackPromptDate!==null&&!isLocalDate(v.lastFeedbackPromptDate))) throw new Error(); return v; } catch { this.clear(); return { ...DEFAULT_ENGAGEMENT_STATE }; } }
  save(state: EngagementState): void { this.storage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(state)); }
  clear(): void { this.storage.removeItem(ENGAGEMENT_STORAGE_KEY); }
}
export const browserEngagementRepository: EngagementRepository = { load:()=>typeof window==='undefined'?{...DEFAULT_ENGAGEMENT_STATE}:new LocalStorageEngagementRepository(localStorage).load(), save:(s)=>{if(typeof window!=='undefined')new LocalStorageEngagementRepository(localStorage).save(s);}, clear:()=>{if(typeof window!=='undefined')new LocalStorageEngagementRepository(localStorage).clear();} };
