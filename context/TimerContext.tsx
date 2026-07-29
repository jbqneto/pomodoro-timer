"use client";

import { createContext, useContext, useState, useRef, ReactNode, useCallback, useEffect } from 'react';
import { useConfig } from './ConfigContext';

type TimerState = 'idle' | 'running' | 'paused';
type Phase = 'focus' | 'break';

export type PresetSettings = {
  focus: number;
  break: number;
  longBreak: number;
}

export type TimerPreset = '25/5' | '15' | 'custom';

export type SessionHistoryEntry = {
  id: string;
  phase: Phase;
  durationMinutes: number;
  completedAt: string;
  task: string;
};

type SessionHistoryStorage = {
  date: string;
  sessions: SessionHistoryEntry[];
};

interface TimerContextType {
  minutes: number;
  seconds: number;
  state: TimerState;
  phase: Phase;
  session: number;
  preset: TimerPreset;
  customPreset: PresetSettings;
  task: string;
  isTaskLocked: boolean;
  sessionHistory: SessionHistoryEntry[];
  sessionHistoryDate: string;
  
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  setPreset: (preset: TimerPreset) => void;
  setCustomPreset: (settings: PresetSettings) => void;
  setTask: (task: string) => void;
  setTaskLocked: (isLocked: boolean) => void;
  clearSessionHistory: () => void;
}

const ENV_PRESET_25 = (process.env.NEXT_PUBLIC_PRESET_25 || '25,5,15').split(',');

const DEFAULT_PRESET: PresetSettings = { 
  focus: parseInt(ENV_PRESET_25[0]), 
  break: parseInt(ENV_PRESET_25[1]), 
  longBreak: parseInt(ENV_PRESET_25[2]) 
};
const QUICK_PRESET: PresetSettings = { focus: 15, break: 2, longBreak: 5 };
const DEFAULT_CUSTOM_PRESET: PresetSettings = { focus: 25, break: 5, longBreak: 15 };
const CUSTOM_PRESET_STORAGE_KEY = 'focus-timer-custom-preset';
const CURRENT_TASK_STORAGE_KEY = 'focus-timer-current-task';
const CURRENT_TASK_LOCKED_STORAGE_KEY = 'focus-timer-current-task-locked';
const SESSION_HISTORY_STORAGE_KEY = 'focus-timer-session-history';
const MAX_HISTORY_ENTRIES = 100;

function isValidPresetSettings(value: unknown): value is PresetSettings {
  if (!value || typeof value !== 'object') return false;

  const settings = value as PresetSettings;
  return [settings.focus, settings.break, settings.longBreak].every(
    (duration) => Number.isInteger(duration) && duration >= 1 && duration <= 180,
  );
}

function isValidHistoryEntry(value: unknown): value is SessionHistoryEntry {
  if (!value || typeof value !== 'object') return false;

  const entry = value as SessionHistoryEntry;
  return (
    typeof entry.id === 'string' &&
    (entry.phase === 'focus' || entry.phase === 'break') &&
    Number.isInteger(entry.durationMinutes) &&
    entry.durationMinutes >= 1 &&
    entry.durationMinutes <= 180 &&
    typeof entry.completedAt === 'string' &&
    !Number.isNaN(new Date(entry.completedAt).getTime()) &&
    typeof entry.task === 'string'
  );
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isValidDateKey(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  return !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
}

function getStoredSessionHistory(value: unknown): SessionHistoryStorage | null {
  if (Array.isArray(value)) {
    const sessions = value.filter(isValidHistoryEntry).slice(0, MAX_HISTORY_ENTRIES);
    if (sessions.length === 0) return null;

    const date = getLocalDateKey(new Date(sessions[0].completedAt));
    return {
      date,
      sessions: sessions.filter((session) => getLocalDateKey(new Date(session.completedAt)) === date),
    };
  }

  if (!value || typeof value !== 'object') return null;

  const storedHistory = value as SessionHistoryStorage;
  if (!isValidDateKey(storedHistory.date) || !Array.isArray(storedHistory.sessions)) return null;

  return {
    date: storedHistory.date,
    sessions: storedHistory.sessions
      .filter(isValidHistoryEntry)
      .filter((session) => getLocalDateKey(new Date(session.completedAt)) === storedHistory.date)
      .slice(0, MAX_HISTORY_ENTRIES),
  };
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const { soundEnabled, soundVolume } = useConfig();
  const [state, setState] = useState<TimerState>('idle');
  const [phase, setPhase] = useState<Phase>('focus');
  const [session, setSession] = useState(1);
  const [preset, setPresetState] = useState<TimerPreset>('25/5');
  const [customPreset, setCustomPresetState] = useState<PresetSettings>(DEFAULT_CUSTOM_PRESET);
  const [seconds, setSeconds] = useState(DEFAULT_PRESET.focus * 60);
  const [task, setTaskState] = useState('');
  const [isTaskLocked, setTaskLockedState] = useState(false);
  const [sessionHistoryStorage, setSessionHistoryStorage] = useState<SessionHistoryStorage>(() => ({
    date: getLocalDateKey(),
    sessions: [],
  }));
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getPresetSettings = useCallback((currentPreset: TimerPreset) => {
    if (currentPreset === 'custom') return customPreset;
    if (currentPreset === '15') return QUICK_PRESET;
    return DEFAULT_PRESET;
  }, [customPreset]);

  const getInitialTime = useCallback((currentPhase: Phase, currentPreset: TimerPreset) => {
    const presetSettings = getPresetSettings(currentPreset);

    return {
      minutes: currentPhase === 'focus' ? presetSettings.focus : presetSettings.break,
      seconds: 0
    }

  }, [getPresetSettings]);

  const setPreset = useCallback((newPreset: TimerPreset) => {
    setPresetState(newPreset);
    
    if (state === 'idle') {
      const { minutes: newMinutes, seconds: newSeconds } = getInitialTime('focus', newPreset);
      setSeconds(newMinutes * 60 + newSeconds);
      setPhase('focus');
    }
  }, [state, getInitialTime]);

  const setCustomPreset = useCallback((settings: PresetSettings) => {
    if (!isValidPresetSettings(settings)) return;

    setCustomPresetState(settings);

    if (state === 'idle') {
      setPresetState('custom');
      setPhase('focus');
      setSeconds(settings.focus * 60);
    }
  }, [state]);

  const setTask = useCallback((nextTask: string) => {
    setTaskState(nextTask.slice(0, 160));
  }, []);

  const setTaskLocked = useCallback((isLocked: boolean) => {
    setTaskLockedState(isLocked);
  }, []);

  const clearSessionHistory = useCallback(() => {
    setSessionHistoryStorage((history) => ({ ...history, sessions: [] }));
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const today = getLocalDateKey();
    setSessionHistoryStorage((history) => (
      history.date === today ? history : { date: today, sessions: [] }
    ));

    setState('running');

    intervalRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          return 0;
        }
    });
      
    }, 1000);

  }, []);

  const pauseTimer = useCallback(() => {
    setState('paused');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resumeTimer = useCallback(() => {
    startTimer();
  }, [startTimer]);

  const stopTimer = useCallback(() => {
    setState('idle');
    setPhase('focus');
    setSession(1);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const { minutes: resetMinutes, seconds: resetSeconds } = getInitialTime('focus', preset);
    setSeconds(resetMinutes * 60 + resetSeconds);
  }, [preset, getInitialTime]);

  useEffect(() => {
    if (alarmRef.current) {
      alarmRef.current.volume = soundEnabled ? soundVolume / 100 : 0;
      alarmRef.current.muted = !soundEnabled;
    }
  }, [soundEnabled, soundVolume]);

  useEffect(() => {
    const storedCustomPreset = window.localStorage.getItem(CUSTOM_PRESET_STORAGE_KEY);
    if (storedCustomPreset) {
      try {
        const parsed = JSON.parse(storedCustomPreset);
        if (isValidPresetSettings(parsed)) {
          setCustomPresetState(parsed);
        }
      } catch {
        window.localStorage.removeItem(CUSTOM_PRESET_STORAGE_KEY);
      }
    }

    const storedTask = window.localStorage.getItem(CURRENT_TASK_STORAGE_KEY) ?? '';
    const nextTask = storedTask.slice(0, 160);
    setTaskState(nextTask);
    setTaskLockedState(
      window.localStorage.getItem(CURRENT_TASK_LOCKED_STORAGE_KEY) === 'true' && nextTask.trim().length > 0,
    );

    const storedHistory = window.localStorage.getItem(SESSION_HISTORY_STORAGE_KEY);
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        const history = getStoredSessionHistory(parsed);
        if (history) {
          setSessionHistoryStorage(history);
        } else {
          window.localStorage.removeItem(SESSION_HISTORY_STORAGE_KEY);
        }
      } catch {
        window.localStorage.removeItem(SESSION_HISTORY_STORAGE_KEY);
      }
    }

    setIsStorageHydrated(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CUSTOM_PRESET_STORAGE_KEY, JSON.stringify(customPreset));
  }, [customPreset]);

  useEffect(() => {
    if (!isStorageHydrated) return;

    window.localStorage.setItem(CURRENT_TASK_STORAGE_KEY, task);
    window.localStorage.setItem(CURRENT_TASK_LOCKED_STORAGE_KEY, String(isTaskLocked));
    window.localStorage.setItem(SESSION_HISTORY_STORAGE_KEY, JSON.stringify(sessionHistoryStorage));
  }, [isStorageHydrated, isTaskLocked, sessionHistoryStorage, task]);

  useEffect(() => {
    if (seconds === 0) {
      setState('idle');

      if (soundEnabled && alarmRef.current) {
        alarmRef.current.play().catch((error) => {
          console.error("Error playing alarm sound:", error);
        });
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const presetSettings = getPresetSettings(preset);
      const completedDuration = phase === 'focus'
        ? presetSettings.focus
        : session % 4 === 0
          ? presetSettings.longBreak
          : presetSettings.break;

      const completedAt = new Date();
      const completedSession: SessionHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        phase,
        durationMinutes: completedDuration,
        completedAt: completedAt.toISOString(),
        task: task.trim(),
      };
      const completedDate = getLocalDateKey(completedAt);

      setSessionHistoryStorage((history) => ({
        date: completedDate,
        sessions: [
          completedSession,
          ...(history.date === completedDate ? history.sessions : []),
        ].slice(0, MAX_HISTORY_ENTRIES),
      }));

      if (phase === 'focus') {
        setPhase('break');
        const breakMinutes = session % 4 === 0 ? presetSettings.longBreak : presetSettings.break;
        setSeconds(breakMinutes * 60);
      } else {
        setPhase('focus');
        setSession((prev) => prev + 1);
        const { minutes: focusMinutes, seconds: focusSeconds } = getInitialTime('focus', preset);
        setSeconds(focusMinutes * 60 + focusSeconds);
      }

    } 
  }, [seconds, phase, preset, getInitialTime, getPresetSettings, session, soundEnabled, task]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <TimerContext.Provider value={{
      minutes: Math.floor(seconds / 60),
      seconds: seconds % 60,
      state,
      phase,
      session,
      preset,
      customPreset,
      task,
      isTaskLocked,
      sessionHistory: sessionHistoryStorage.sessions,
      sessionHistoryDate: sessionHistoryStorage.date,
      startTimer,
      pauseTimer,
      resumeTimer,
      stopTimer,
      setPreset,
      setCustomPreset,
      setTask,
      setTaskLocked,
      clearSessionHistory,
    }}>
      {children}

      <audio
        ref={alarmRef}
        src="/sounds/alarm-clock.mp3"
        preload="auto"
        playsInline
        className="hidden"
      />
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
