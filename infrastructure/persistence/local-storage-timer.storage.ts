import { isValidPresetSettings } from '@/core/timer/timer.presets';
import { PersistedTimerData, SessionHistoryEntry, SessionHistoryStorage, TimerStorage } from './timer-storage';

export const TIMER_STORAGE_KEYS = {
  customPreset: 'focus-timer-custom-preset', task: 'focus-timer-current-task',
  taskLocked: 'focus-timer-current-task-locked', history: 'focus-timer-session-history',
} as const;
export const MAX_HISTORY_ENTRIES = 100;
export const MAX_TASK_LENGTH = 160;

export function getLocalDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function validDateKey(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}
function normalizeHistoryEntry(value: unknown): SessionHistoryEntry | null {
  if (!value || typeof value !== 'object') return null;
  const entry = value as Partial<SessionHistoryEntry>;
  const { id, phase, durationMinutes, completedAt: completedAtValue, startedAt: storedStartedAt, task } = entry;
  if (typeof id !== 'string' || (phase !== 'focus' && phase !== 'break') ||
    typeof durationMinutes !== 'number' || !Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 180 ||
    typeof completedAtValue !== 'string' || Number.isNaN(new Date(completedAtValue).getTime()) || typeof task !== 'string') return null;

  const completedAt = new Date(completedAtValue);
  const startedAt = typeof storedStartedAt === 'string' &&
    !Number.isNaN(new Date(storedStartedAt).getTime()) &&
    new Date(storedStartedAt) <= completedAt
      ? storedStartedAt
      : new Date(completedAt.getTime() - durationMinutes * 60_000).toISOString();

  return { id, phase, durationMinutes, startedAt, completedAt: completedAtValue, task };
}

function normalizeHistoryEntries(entries: unknown[]): SessionHistoryEntry[] {
  return entries
    .map(normalizeHistoryEntry)
    .filter((entry): entry is SessionHistoryEntry => entry !== null)
    .slice(0, MAX_HISTORY_ENTRIES);
}
export function parseSessionHistory(value: unknown): SessionHistoryStorage | null {
  if (Array.isArray(value)) {
    const sessions = normalizeHistoryEntries(value);
    if (!sessions.length) return null;
    const date = getLocalDateKey(new Date(sessions[0].completedAt));
    return { date, sessions: sessions.filter((item) => getLocalDateKey(new Date(item.completedAt)) === date) };
  }
  if (!value || typeof value !== 'object') return null;
  const history = value as SessionHistoryStorage;
  if (!validDateKey(history.date) || !Array.isArray(history.sessions)) return null;
  return { date: history.date, sessions: normalizeHistoryEntries(history.sessions)
    .filter((item) => getLocalDateKey(new Date(item.completedAt)) === history.date).slice(0, MAX_HISTORY_ENTRIES) };
}

export class LocalStorageTimerStorage implements TimerStorage {
  constructor(private readonly storage: Storage) {}
  private json(key: string): unknown {
    const raw = this.storage.getItem(key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { this.storage.removeItem(key); return null; }
  }
  load(): PersistedTimerData {
    const presetValue = this.json(TIMER_STORAGE_KEYS.customPreset);
    if (presetValue !== null && !isValidPresetSettings(presetValue)) this.storage.removeItem(TIMER_STORAGE_KEYS.customPreset);
    const historyValue = this.json(TIMER_STORAGE_KEYS.history);
    const history = parseSessionHistory(historyValue);
    if (historyValue !== null && !history) this.storage.removeItem(TIMER_STORAGE_KEYS.history);
    const task = (this.storage.getItem(TIMER_STORAGE_KEYS.task) ?? '').slice(0, MAX_TASK_LENGTH);
    return { customPreset: isValidPresetSettings(presetValue) ? presetValue : null, task,
      isTaskLocked: this.storage.getItem(TIMER_STORAGE_KEYS.taskLocked) === 'true' && task.trim().length > 0, history };
  }
  saveCustomPreset(value: import('@/core/timer/timer.types').PresetSettings): void { this.storage.setItem(TIMER_STORAGE_KEYS.customPreset, JSON.stringify(value)); }
  saveTask(value: string, locked: boolean): void {
    const task = value.slice(0, MAX_TASK_LENGTH);
    this.storage.setItem(TIMER_STORAGE_KEYS.task, task);
    this.storage.setItem(TIMER_STORAGE_KEYS.taskLocked, String(locked && task.trim().length > 0));
  }
  saveHistory(value: SessionHistoryStorage): void { this.storage.setItem(TIMER_STORAGE_KEYS.history, JSON.stringify(value)); }
  clearHistory(): void { this.storage.removeItem(TIMER_STORAGE_KEYS.history); }
}
export const defaultTimerStorage: TimerStorage = {
  load: () => typeof window === 'undefined' ? { customPreset: null, task: '', isTaskLocked: false, history: null } : new LocalStorageTimerStorage(window.localStorage).load(),
  saveCustomPreset: (v) => { if (typeof window !== 'undefined') new LocalStorageTimerStorage(window.localStorage).saveCustomPreset(v); },
  saveTask: (v, l) => { if (typeof window !== 'undefined') new LocalStorageTimerStorage(window.localStorage).saveTask(v, l); },
  saveHistory: (v) => { if (typeof window !== 'undefined') new LocalStorageTimerStorage(window.localStorage).saveHistory(v); },
  clearHistory: () => { if (typeof window !== 'undefined') new LocalStorageTimerStorage(window.localStorage).clearHistory(); },
};
