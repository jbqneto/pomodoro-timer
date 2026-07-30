import { beforeEach, describe, expect, it } from 'vitest';
import { LocalStorageConfigRepository, CONFIG_STORAGE_KEY } from '@/infrastructure/persistence/local-storage-config.repository';
import { LocalStorageTimerStorage, TIMER_STORAGE_KEYS } from '@/infrastructure/persistence/local-storage-timer.storage';

describe('localStorage adapters', () => {
  beforeEach(() => localStorage.clear());
  it('loads missing configuration as null and saves/clears valid data', () => {
    const repository = new LocalStorageConfigRepository(localStorage);
    expect(repository.load()).toBeNull();
    const config = { activePlaylist: 'lofi' as const, soundEnabled: false, autoPlay: false, soundVolume: 0, musicVolume: 100, showBreakTips: false };
    repository.save(config); expect(repository.load()).toEqual(config);
    repository.clear(); expect(localStorage.getItem(CONFIG_STORAGE_KEY)).toBeNull();
  });
  it('defaults missing or invalid break-tip preferences without changing other settings', () => {
    const repository = new LocalStorageConfigRepository(localStorage);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ activePlaylist: 'lofi', showBreakTips: 'no' }));
    expect(repository.load()).toMatchObject({ activePlaylist: 'lofi', showBreakTips: true });
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ showBreakTips: false }));
    expect(repository.load()?.showBreakTips).toBe(false);
  });
  it('migrates the catholic playlist identifier', () => {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ activePlaylist: 'catholic', soundEnabled: true, autoPlay: true, soundVolume: 20, musicVolume: 30 }));
    expect(new LocalStorageConfigRepository(localStorage).load()?.activePlaylist).toBe('gregorian');
  });
  it.each(['bad json', JSON.stringify([]), JSON.stringify({ soundVolume: -1 })])('cleans invalid configuration: %s', (raw) => {
    localStorage.setItem(CONFIG_STORAGE_KEY, raw);
    expect(new LocalStorageConfigRepository(localStorage).load()).toBeNull();
    expect(localStorage.getItem(CONFIG_STORAGE_KEY)).toBeNull();
  });
  it('loads and truncates task state', () => {
    localStorage.setItem(TIMER_STORAGE_KEYS.task, 'x'.repeat(200));
    localStorage.setItem(TIMER_STORAGE_KEYS.taskLocked, 'true');
    const loaded = new LocalStorageTimerStorage(localStorage).load();
    expect(loaded.task).toHaveLength(160); expect(loaded.isTaskLocked).toBe(true);
  });
  it('loads current history and migrates legacy arrays', () => {
    const entry = { id: '1', phase: 'focus', durationMinutes: 25, completedAt: '2026-07-30T12:00:00.000Z', task: '' };
    const storage = new LocalStorageTimerStorage(localStorage);
    localStorage.setItem(TIMER_STORAGE_KEYS.history, JSON.stringify([entry]));
    expect(storage.load().history).toEqual({ date: '2026-07-30', sessions: [entry] });
    localStorage.setItem(TIMER_STORAGE_KEYS.history, JSON.stringify({ date: '2026-07-30', sessions: [entry] }));
    expect(storage.load().history?.sessions).toEqual([entry]);
  });
  it('cleans invalid dates and corrupt timer JSON', () => {
    const storage = new LocalStorageTimerStorage(localStorage);
    localStorage.setItem(TIMER_STORAGE_KEYS.history, JSON.stringify({ date: '2026-02-30', sessions: [] }));
    localStorage.setItem(TIMER_STORAGE_KEYS.customPreset, '{{');
    expect(storage.load()).toMatchObject({ customPreset: null, history: null });
    expect(localStorage.getItem(TIMER_STORAGE_KEYS.history)).toBeNull();
    expect(localStorage.getItem(TIMER_STORAGE_KEYS.customPreset)).toBeNull();
  });
  it('saves and clears timer values', () => {
    const storage = new LocalStorageTimerStorage(localStorage);
    storage.saveCustomPreset({ focus: 1, break: 2, longBreak: 3 }); storage.saveTask('task', true);
    storage.saveHistory({ date: '2026-07-30', sessions: [] });
    expect(localStorage.getItem(TIMER_STORAGE_KEYS.task)).toBe('task');
    storage.clearHistory(); expect(localStorage.getItem(TIMER_STORAGE_KEYS.history)).toBeNull();
  });
});
