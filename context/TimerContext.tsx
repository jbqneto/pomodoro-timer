"use client";

import { createContext, useContext, useState, useRef, ReactNode, useCallback, useEffect } from "react";
import { useConfig } from "./ConfigContext";

type TimerState = "idle" | "running" | "paused";
type Phase = "focus" | "break";
export type PresetSettings = { focus: number; break: number; longBreak: number };
export type TimerPreset = "25/5" | "15" | "custom";
export type SessionHistoryEntry = { id: string; phase: Phase; durationMinutes: number; completedAt: string; task: string };
type SessionHistoryStorage = { date: string; sessions: SessionHistoryEntry[] };

interface TimerContextType {
  minutes: number; seconds: number; state: TimerState; phase: Phase; session: number;
  preset: TimerPreset; customPreset: PresetSettings; task: string; isTaskLocked: boolean;
  sessionHistory: SessionHistoryEntry[]; sessionHistoryDate: string;
  startTimer: () => void; pauseTimer: () => void; resumeTimer: () => void;
  restartPhase: () => void; abandonCycle: () => void;
  /** @deprecated Use abandonCycle. */ stopTimer: () => void;
  setPreset: (preset: TimerPreset) => void; setCustomPreset: (settings: PresetSettings) => void;
  setTask: (task: string) => void; setTaskLocked: (isLocked: boolean) => void; clearSessionHistory: () => void;
}

const ENV_PRESET_25 = (process.env.NEXT_PUBLIC_PRESET_25 || "25,5,15").split(",");
const DEFAULT_PRESET: PresetSettings = { focus: parseInt(ENV_PRESET_25[0]), break: parseInt(ENV_PRESET_25[1]), longBreak: parseInt(ENV_PRESET_25[2]) };
const QUICK_PRESET: PresetSettings = { focus: 15, break: 2, longBreak: 5 };
const DEFAULT_CUSTOM_PRESET: PresetSettings = { focus: 25, break: 5, longBreak: 15 };
const CUSTOM_PRESET_STORAGE_KEY = "focus-timer-custom-preset";
const CURRENT_TASK_STORAGE_KEY = "focus-timer-current-task";
const CURRENT_TASK_LOCKED_STORAGE_KEY = "focus-timer-current-task-locked";
const SESSION_HISTORY_STORAGE_KEY = "focus-timer-session-history";
const MAX_HISTORY_ENTRIES = 100;
const UPDATE_INTERVAL_MS = 250;

function isValidPresetSettings(value: unknown): value is PresetSettings {
  if (!value || typeof value !== "object") return false;
  const settings = value as PresetSettings;
  return [settings.focus, settings.break, settings.longBreak].every((duration) => Number.isInteger(duration) && duration >= 1 && duration <= 180);
}
function isValidHistoryEntry(value: unknown): value is SessionHistoryEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as SessionHistoryEntry;
  return typeof entry.id === "string" && (entry.phase === "focus" || entry.phase === "break") &&
    Number.isInteger(entry.durationMinutes) && entry.durationMinutes >= 1 && entry.durationMinutes <= 180 &&
    typeof entry.completedAt === "string" && !Number.isNaN(new Date(entry.completedAt).getTime()) && typeof entry.task === "string";
}
function getLocalDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function isValidDateKey(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
}
function getStoredSessionHistory(value: unknown): SessionHistoryStorage | null {
  if (Array.isArray(value)) {
    const sessions = value.filter(isValidHistoryEntry).slice(0, MAX_HISTORY_ENTRIES);
    if (!sessions.length) return null;
    const date = getLocalDateKey(new Date(sessions[0].completedAt));
    return { date, sessions: sessions.filter((item) => getLocalDateKey(new Date(item.completedAt)) === date) };
  }
  if (!value || typeof value !== "object") return null;
  const history = value as SessionHistoryStorage;
  if (!isValidDateKey(history.date) || !Array.isArray(history.sessions)) return null;
  return { date: history.date, sessions: history.sessions.filter(isValidHistoryEntry).filter((item) => getLocalDateKey(new Date(item.completedAt)) === history.date).slice(0, MAX_HISTORY_ENTRIES) };
}
export function remainingFromEndAt(endAt: number, now = Date.now()) {
  return Math.max(0, Math.ceil((endAt - now) / 1000));
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const { soundEnabled, soundVolume } = useConfig();
  const [state, setState] = useState<TimerState>("idle");
  const [phase, setPhase] = useState<Phase>("focus");
  const [session, setSession] = useState(1);
  const [preset, setPresetState] = useState<TimerPreset>("25/5");
  const [customPreset, setCustomPresetState] = useState(DEFAULT_CUSTOM_PRESET);
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_PRESET.focus * 60);
  const [task, setTaskState] = useState("");
  const [isTaskLocked, setTaskLockedState] = useState(false);
  const [history, setHistory] = useState<SessionHistoryStorage>(() => ({ date: getLocalDateKey(), sessions: [] }));
  const [storageHydrated, setStorageHydrated] = useState(false);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const totalSecondsRef = useRef(totalSeconds);
  totalSecondsRef.current = totalSeconds;
  const endAtRef = useRef<number | null>(null);
  const completionClaimedRef = useRef(false);
  const snapshotRef = useRef({ state, phase, session, preset, customPreset, task, soundEnabled });
  snapshotRef.current = { state, phase, session, preset, customPreset, task, soundEnabled };

  const getPresetSettings = useCallback((value: TimerPreset) => value === "custom" ? customPreset : value === "15" ? QUICK_PRESET : DEFAULT_PRESET, [customPreset]);
  const phaseDuration = useCallback((currentPhase: Phase, currentSession: number, currentPreset: TimerPreset) => {
    const settings = getPresetSettings(currentPreset);
    return currentPhase === "focus" ? settings.focus : currentSession % 4 === 0 ? settings.longBreak : settings.break;
  }, [getPresetSettings]);
  const clearTicker = useCallback(() => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const completePhase = useCallback(() => {
    if (completionClaimedRef.current) return;
    completionClaimedRef.current = true;
    clearTicker();
    endAtRef.current = null;
    const current = snapshotRef.current;
    setState("idle");
    if (current.soundEnabled && alarmRef.current) void alarmRef.current.play().catch((error) => console.error("Error playing alarm sound:", error));
    const completedAt = new Date();
    const completed: SessionHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, phase: current.phase,
      durationMinutes: phaseDuration(current.phase, current.session, current.preset), completedAt: completedAt.toISOString(), task: current.task.trim(),
    };
    const date = getLocalDateKey(completedAt);
    setHistory((previous) => ({ date, sessions: [completed, ...(previous.date === date ? previous.sessions : [])].slice(0, MAX_HISTORY_ENTRIES) }));
    const settings = current.preset === "custom" ? current.customPreset : current.preset === "15" ? QUICK_PRESET : DEFAULT_PRESET;
    if (current.phase === "focus") {
      setPhase("break");
      setTotalSeconds((current.session % 4 === 0 ? settings.longBreak : settings.break) * 60);
    } else {
      setPhase("focus"); setSession(current.session + 1); setTotalSeconds(settings.focus * 60);
    }
  }, [clearTicker, phaseDuration]);
  const tick = useCallback(() => {
    if (snapshotRef.current.state !== "running" || endAtRef.current === null) return;
    const remaining = remainingFromEndAt(endAtRef.current);
    setTotalSeconds(remaining);
    if (remaining === 0) completePhase();
  }, [completePhase]);

  const startTimer = useCallback(() => {
    if (snapshotRef.current.state === "running") return;
    setHistory((previous) => previous.date === getLocalDateKey() ? previous : { date: getLocalDateKey(), sessions: [] });
    completionClaimedRef.current = false;
    endAtRef.current = Date.now() + totalSecondsRef.current * 1000;
    setState("running");
  }, []);
  const pauseTimer = useCallback(() => {
    if (snapshotRef.current.state !== "running") return;
    const remaining = endAtRef.current === null ? totalSecondsRef.current : remainingFromEndAt(endAtRef.current);
    clearTicker(); endAtRef.current = null; setTotalSeconds(remaining); setState("paused");
  }, [clearTicker]);
  const resumeTimer = useCallback(() => {
    if (snapshotRef.current.state !== "paused") return;
    completionClaimedRef.current = false; endAtRef.current = Date.now() + totalSecondsRef.current * 1000; setState("running");
  }, []);
  const restartPhase = useCallback(() => {
    clearTicker(); endAtRef.current = null; completionClaimedRef.current = false; setState("idle");
    const current = snapshotRef.current;
    setTotalSeconds(phaseDuration(current.phase, current.session, current.preset) * 60);
  }, [clearTicker, phaseDuration]);
  const abandonCycle = useCallback(() => {
    clearTicker(); endAtRef.current = null; completionClaimedRef.current = false;
    setState("idle"); setPhase("focus"); setSession(1);
    setTotalSeconds(getPresetSettings(snapshotRef.current.preset).focus * 60);
  }, [clearTicker, getPresetSettings]);

  const setPreset = useCallback((next: TimerPreset) => {
    setPresetState(next);
    if (snapshotRef.current.state === "idle") { const nextSeconds = (next === "custom" ? customPreset : next === "15" ? QUICK_PRESET : DEFAULT_PRESET).focus * 60; totalSecondsRef.current = nextSeconds; setPhase("focus"); setTotalSeconds(nextSeconds); }
  }, [customPreset]);
  const setCustomPreset = useCallback((settings: PresetSettings) => {
    if (!isValidPresetSettings(settings)) return;
    setCustomPresetState(settings);
    if (snapshotRef.current.state === "idle") { totalSecondsRef.current = settings.focus * 60; snapshotRef.current.preset = "custom"; snapshotRef.current.customPreset = settings; setPresetState("custom"); setPhase("focus"); setTotalSeconds(settings.focus * 60); }
  }, []);

  useEffect(() => {
    if (state !== "running") return;
    tick(); intervalRef.current = window.setInterval(tick, UPDATE_INTERVAL_MS);
    return clearTicker;
  }, [clearTicker, state, tick]);
  useEffect(() => {
    const onVisibilityChange = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [tick]);
  useEffect(() => () => clearTicker(), [clearTicker]);
  useEffect(() => { if (alarmRef.current) { alarmRef.current.volume = soundEnabled ? soundVolume / 100 : 0; alarmRef.current.muted = !soundEnabled; } }, [soundEnabled, soundVolume]);

  useEffect(() => {
    const custom = localStorage.getItem(CUSTOM_PRESET_STORAGE_KEY);
    if (custom) try { const parsed: unknown = JSON.parse(custom); if (isValidPresetSettings(parsed)) setCustomPresetState(parsed); else localStorage.removeItem(CUSTOM_PRESET_STORAGE_KEY); } catch { localStorage.removeItem(CUSTOM_PRESET_STORAGE_KEY); }
    const storedTask = localStorage.getItem(CURRENT_TASK_STORAGE_KEY) ?? "";
    setTaskState(storedTask.slice(0, 160));
    setTaskLockedState(localStorage.getItem(CURRENT_TASK_LOCKED_STORAGE_KEY) === "true" && storedTask.trim().length > 0);
    const storedHistory = localStorage.getItem(SESSION_HISTORY_STORAGE_KEY);
    if (storedHistory) try { const parsed = getStoredSessionHistory(JSON.parse(storedHistory)); if (parsed) setHistory(parsed); else localStorage.removeItem(SESSION_HISTORY_STORAGE_KEY); } catch { localStorage.removeItem(SESSION_HISTORY_STORAGE_KEY); }
    setStorageHydrated(true);
  }, []);
  useEffect(() => { localStorage.setItem(CUSTOM_PRESET_STORAGE_KEY, JSON.stringify(customPreset)); }, [customPreset]);
  useEffect(() => { if (storageHydrated) { localStorage.setItem(CURRENT_TASK_STORAGE_KEY, task); localStorage.setItem(CURRENT_TASK_LOCKED_STORAGE_KEY, String(isTaskLocked)); localStorage.setItem(SESSION_HISTORY_STORAGE_KEY, JSON.stringify(history)); } }, [history, isTaskLocked, storageHydrated, task]);

  return <TimerContext.Provider value={{
    minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60, state, phase, session, preset, customPreset, task, isTaskLocked,
    sessionHistory: history.sessions, sessionHistoryDate: history.date, startTimer, pauseTimer, resumeTimer, restartPhase, abandonCycle,
    stopTimer: abandonCycle, setPreset, setCustomPreset, setTask: (value) => setTaskState(value.slice(0, 160)), setTaskLocked: setTaskLockedState,
    clearSessionHistory: () => setHistory((previous) => ({ ...previous, sessions: [] })),
  }}>{children}<audio ref={alarmRef} src="/sounds/alarm-clock.mp3" preload="auto" playsInline className="hidden" /></TimerContext.Provider>;
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within a TimerProvider");
  return context;
}
