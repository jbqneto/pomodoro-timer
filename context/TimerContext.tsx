"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useConfig } from './ConfigContext';
import { DEFAULT_CUSTOM_PRESET, DEFAULT_PRESET, getPresetSettings, isValidPresetSettings } from '@/core/timer/timer.presets';
import { abandonCycle, calculateRemainingSeconds, getNextTimerTransition, getPhaseDurationMinutes } from '@/core/timer/timer.rules';
import { PresetSettings, TimerPhase, TimerPreset, TimerStatus } from '@/core/timer/timer.types';
import { defaultTimerStorage, getLocalDateKey, MAX_HISTORY_ENTRIES, MAX_TASK_LENGTH } from '@/infrastructure/persistence/local-storage-timer.storage';
import { SessionHistoryEntry, SessionHistoryStorage, TimerStorage } from '@/infrastructure/persistence/timer-storage';
import { Clock } from '@/application/ports/clock';
import { ProductAnalytics } from '@/application/ports/product-analytics';
import { BrowserClock } from '@/infrastructure/time/browser-clock';
import { NoopProductAnalytics } from '@/infrastructure/analytics/noop-product-analytics';
import { toFocusEventProperties } from '@/application/analytics/focus-event-properties';

export type { PresetSettings, TimerPreset } from '@/core/timer/timer.types';
export type { SessionHistoryEntry } from '@/infrastructure/persistence/timer-storage';

interface TimerContextType {
  minutes: number; seconds: number; state: TimerStatus; phase: TimerPhase; session: number;
  preset: TimerPreset; customPreset: PresetSettings; task: string; isTaskLocked: boolean;
  sessionHistory: SessionHistoryEntry[]; sessionHistoryDate: string;
  startTimer(): void; pauseTimer(): void; resumeTimer(): void; stopTimer(): void;
  setPreset(value: TimerPreset): void; setCustomPreset(value: PresetSettings): void;
  setTask(value: string): void; setTaskLocked(value: boolean): void; clearSessionHistory(): void;
}
const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children, storage = defaultTimerStorage, clock = new BrowserClock(), analytics = new NoopProductAnalytics(), onFocusCompleted }: { children: ReactNode; storage?: TimerStorage; clock?: Clock; analytics?: ProductAnalytics; onFocusCompleted?: () => void }) {
  const { soundEnabled, soundVolume, activePlaylist, interfaceMode } = useConfig();
  const [state, setState] = useState<TimerStatus>('idle');
  const [phase, setPhase] = useState<TimerPhase>('focus');
  const [session, setSession] = useState(1);
  const [preset, setPresetState] = useState<TimerPreset>('25/5');
  const [customPreset, setCustomPresetState] = useState(DEFAULT_CUSTOM_PRESET);
  const [seconds, setSeconds] = useState(DEFAULT_PRESET.focus * 60);
  const secondsRef = useRef(DEFAULT_PRESET.focus * 60);
  const [task, setTaskState] = useState('');
  const [isTaskLocked, setTaskLockedState] = useState(false);
  const [history, setHistory] = useState<SessionHistoryStorage>({ date: getLocalDateKey(new Date(clock.now())), sessions: [] });
  const [hydrated, setHydrated] = useState(false);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endAtRef = useRef<number | null>(null);

  const clearTick = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    endAtRef.current = null;
  }, []);
  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const today = getLocalDateKey(new Date(clock.now()));
    setHistory((current) => current.date === today ? current : { date: today, sessions: [] });
    if (state === 'idle' && phase === 'focus') { try { analytics.track({name:'focus_started',properties:toFocusEventProperties(preset,customPreset,activePlaylist,interfaceMode)}); } catch {} }
    const endAt = clock.now() + secondsRef.current * 1000;
    endAtRef.current = endAt;
    setState('running');
    const tick = () => { const remaining = calculateRemainingSeconds(endAt, clock.now()); secondsRef.current = remaining; setSeconds(remaining); };
    intervalRef.current = setInterval(tick, 1000);
  }, [activePlaylist, analytics, clock, customPreset, interfaceMode, phase, preset, state]);
  const pauseTimer = useCallback(() => {
    if (endAtRef.current !== null) { const remaining = calculateRemainingSeconds(endAtRef.current, clock.now()); secondsRef.current = remaining; setSeconds(remaining); }
    clearTick(); setState('paused');
  }, [clearTick, clock]);
  const stopTimer = useCallback(() => {
    if (phase === 'focus' && state !== 'idle') { try { analytics.track({name:'focus_abandoned',properties:toFocusEventProperties(preset,customPreset,activePlaylist,interfaceMode)}); } catch {} }
    clearTick();
    const reset = abandonCycle({ preset, customPreset });
    secondsRef.current = reset.durationMinutes * 60;
    setState(reset.status); setPhase(reset.phase); setSession(reset.session); setSeconds(secondsRef.current);
  }, [activePlaylist, analytics, clearTick, customPreset, interfaceMode, phase, preset, state]);
  const setPreset = useCallback((value: TimerPreset) => {
    setPresetState(value);
    if (state === 'idle') { secondsRef.current = getPresetSettings(value, customPreset).focus * 60; setPhase('focus'); setSeconds(secondsRef.current); }
  }, [customPreset, state]);
  const setCustomPreset = useCallback((value: PresetSettings) => {
    if (!isValidPresetSettings(value)) return;
    setCustomPresetState(value);
    if (state === 'idle') { secondsRef.current = value.focus * 60; setPresetState('custom'); setPhase('focus'); setSeconds(secondsRef.current); }
  }, [state]);

  useEffect(() => {
    const stored = storage.load();
    if (stored.customPreset) setCustomPresetState(stored.customPreset);
    setTaskState(stored.task); setTaskLockedState(stored.isTaskLocked);
    if (stored.history) setHistory(stored.history);
    setHydrated(true);
  }, [storage]);
  useEffect(() => { if (hydrated) storage.saveCustomPreset(customPreset); }, [customPreset, hydrated, storage]);
  useEffect(() => { if (hydrated) storage.saveTask(task, isTaskLocked); }, [hydrated, isTaskLocked, storage, task]);
  useEffect(() => { if (hydrated) storage.saveHistory(history); }, [history, hydrated, storage]);
  useEffect(() => {
    if (alarmRef.current) { alarmRef.current.volume = soundEnabled ? soundVolume / 100 : 0; alarmRef.current.muted = !soundEnabled; }
  }, [soundEnabled, soundVolume]);
  useEffect(() => {
    if (seconds !== 0 || state !== 'running') return;
    clearTick(); setState('idle');
    if (soundEnabled && alarmRef.current) alarmRef.current.play().catch((error) => console.error('Error playing alarm sound:', error));
    const completedAt = new Date(clock.now());
    const durationMinutes = getPhaseDurationMinutes({ phase, session, preset, customPreset });
    const entry: SessionHistoryEntry = { id: `${clock.now()}-${Math.random().toString(36).slice(2, 8)}`,
      phase, durationMinutes, completedAt: completedAt.toISOString(), task: task.trim() };
    const date = getLocalDateKey(completedAt);
    setHistory((current) => ({ date, sessions: [entry, ...(current.date === date ? current.sessions : [])].slice(0, MAX_HISTORY_ENTRIES) }));
    if (phase === 'focus') { try { analytics.track({name:'focus_completed',properties:toFocusEventProperties(preset,customPreset,activePlaylist,interfaceMode)}); } catch {} onFocusCompleted?.(); }
    const next = getNextTimerTransition({ phase, session, preset, customPreset });
    secondsRef.current = next.durationMinutes * 60;
    setPhase(next.phase); setSession(next.session); setSeconds(secondsRef.current);
  }, [activePlaylist, analytics, clearTick, clock, customPreset, interfaceMode, onFocusCompleted, phase, preset, seconds, session, soundEnabled, state, task]);
  useEffect(() => {
    const sync = () => { if (endAtRef.current !== null) { const remaining = calculateRemainingSeconds(endAtRef.current, clock.now()); secondsRef.current = remaining; setSeconds(remaining); } };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [clock]);
  useEffect(() => clearTick, [clearTick]);

  return <TimerContext.Provider value={{ minutes: Math.floor(seconds / 60), seconds: seconds % 60, state, phase, session,
    preset, customPreset, task, isTaskLocked, sessionHistory: history.sessions, sessionHistoryDate: history.date,
    startTimer, pauseTimer, resumeTimer: startTimer,
    stopTimer, // Compatibility: existing controls consume this name for abandoning the cycle.
    setPreset, setCustomPreset, setTask: (value) => setTaskState(value.slice(0, MAX_TASK_LENGTH)),
    setTaskLocked: setTaskLockedState, clearSessionHistory: () => setHistory((current) => ({ ...current, sessions: [] })),
  }}>{children}<audio ref={alarmRef} src="/sounds/alarm-clock.mp3" preload="auto" playsInline className="hidden" /></TimerContext.Provider>;
}
export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) throw new Error('useTimer must be used within a TimerProvider');
  return context;
}
