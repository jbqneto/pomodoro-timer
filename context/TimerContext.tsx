"use client";

import { createContext, useContext, useState, useRef, ReactNode, useCallback, useEffect } from 'react';
import { useConfig } from './ConfigContext';

type TimerState = 'idle' | 'running' | 'paused';
type Phase = 'focus' | 'break';

type PresetSettings = {
  focus: number;
  break: number;
  longBreak: number;
}

interface TimerContextType {
  minutes: number;
  seconds: number;
  state: TimerState;
  phase: Phase;
  session: number;
  preset: '25/5' | '15';
  
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  setPreset: (preset: '25/5' | '15') => void;
}

const ENV_PRESET_25 = (process.env.NEXT_PUBLIC_PRESET_25 || '25,5,15').split(',');

const DEFAULT_PRESET: PresetSettings = { 
  focus: parseInt(ENV_PRESET_25[0]), 
  break: parseInt(ENV_PRESET_25[1]), 
  longBreak: parseInt(ENV_PRESET_25[2]) 
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const { soundEnabled, soundVolume } = useConfig();
  const [state, setState] = useState<TimerState>('idle');
  const [phase, setPhase] = useState<Phase>('focus');
  const [session, setSession] = useState(1);
  const [preset, setPresetState] = useState<'25/5' | '15'>('25/5');
  const [seconds, setSeconds] = useState(DEFAULT_PRESET.focus * 60);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const presetMap = new Map<string, PresetSettings>();
  presetMap.set('25/5', DEFAULT_PRESET);
  presetMap.set('15', { focus: 15, break: 2, longBreak: 5 });

  const getInitialTime = useCallback((currentPhase: Phase, currentPreset: '25/5' | '15') => {
    let presetSettings = presetMap.get(currentPreset) ?? DEFAULT_PRESET;

    return {
      minutes: currentPhase === 'focus' ? presetSettings.focus : presetSettings.break,
      seconds: 0
    }

  }, []);

  const setPreset = useCallback((newPreset: '25/5' | '15') => {
    setPresetState(newPreset);
    
    if (state === 'idle') {
      const { minutes: newMinutes, seconds: newSeconds } = getInitialTime('focus', newPreset);
      setSeconds(newMinutes * 60 + newSeconds);
      setPhase('focus');
    }
  }, [state, getInitialTime]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

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

      if (phase === 'focus') {
        setPhase('break');
        const presetSettings = presetMap.get(preset) ?? DEFAULT_PRESET;
        const breakMinutes = session % 4 === 0 ? presetSettings.longBreak : presetSettings.break;
        setSeconds(breakMinutes * 60);
      } else {
        setPhase('focus');
        setSession((prev) => prev + 1);
        const { minutes: focusMinutes, seconds: focusSeconds } = getInitialTime('focus', preset);
        setSeconds(focusMinutes * 60 + focusSeconds);
      }

    } 
  }, [seconds, phase, preset, getInitialTime, session, soundEnabled]);

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
      startTimer,
      pauseTimer,
      resumeTimer,
      stopTimer,
      setPreset
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
