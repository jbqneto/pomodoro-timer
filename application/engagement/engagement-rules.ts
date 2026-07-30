import { ReturnGapBucket } from '@/application/ports/product-analytics';
import { EngagementState } from '@/application/ports/engagement.repository';
const dayNumber=(key:string)=>{const [y,m,d]=key.split('-').map(Number); return Date.UTC(y,m-1,d)/86400000;};
export function getReturnGap(previousDate:string,currentDate:string):ReturnGapBucket|null { const days=dayNumber(currentDate)-dayNumber(previousDate); return days===1?'next_day':days>=2&&days<=7?'2_to_7_days':days>=8?'8_plus_days':null; }
export function shouldPromptUsefulnessFeedback(state:EngagementState,currentDate:string):boolean { return !!state.lastFocusCompletionDate && state.lastFocusCompletionDate!==currentDate && (!state.lastFeedbackPromptDate || dayNumber(currentDate)-dayNumber(state.lastFeedbackPromptDate)>=14); }
