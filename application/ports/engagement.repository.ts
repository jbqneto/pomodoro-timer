export type EngagementState = { version: 1; lastFocusCompletionDate: string | null; lastFeedbackPromptDate: string | null };
export const DEFAULT_ENGAGEMENT_STATE: EngagementState = { version: 1, lastFocusCompletionDate: null, lastFeedbackPromptDate: null };
export interface EngagementRepository { load(): EngagementState; save(state: EngagementState): void; clear(): void; }
