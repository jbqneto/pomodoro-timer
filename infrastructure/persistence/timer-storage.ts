import { PresetSettings, TimerPhase } from '@/core/timer/timer.types';

export type SessionHistoryEntry = { id: string; phase: TimerPhase; durationMinutes: number; startedAt: string; completedAt: string; task: string };
export type SessionHistoryStorage = { date: string; sessions: SessionHistoryEntry[] };
export type PersistedTimerData = { customPreset: PresetSettings | null; task: string; isTaskLocked: boolean; history: SessionHistoryStorage | null };

export interface TimerStorage {
  load(): PersistedTimerData;
  saveCustomPreset(value: PresetSettings): void;
  saveTask(value: string, locked: boolean): void;
  saveHistory(value: SessionHistoryStorage): void;
  clearHistory(): void;
}
