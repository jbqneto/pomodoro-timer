"use client";

import { createContext, useContext, useState, useRef, ReactNode, useCallback } from 'react';

type TimerState = 'idle' | 'running' | 'paused';
type Phase = 'focus' | 'break';

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

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TimerState>('idle');
  const [phase, setPhase] = useState<Phase>('focus');
  const [session, setSession] = useState(1);
  const [preset, setPresetState] = useState<'25/5' | '15'>('25/5');
  
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getInitialTime = useCallback((currentPhase: Phase, currentPreset: '25/5' | '15') => {
    if (currentPreset === '15') {
      return { minutes: 15, seconds: 0 };
    }
    
    return currentPhase === 'focus' 
      ? { minutes: 25, seconds: 0 }
      : { minutes: 5, seconds: 0 };
  }, []);

  const setPreset = useCallback((newPreset: '25/5' | '15') => {
    setPresetState(newPreset);
    
    if (state === 'idle') {
      const { minutes: newMinutes, seconds: newSeconds } = getInitialTime('focus', newPreset);
      setMinutes(newMinutes);
      setSeconds(newSeconds);
      setPhase('focus');
    }
  }, [state, getInitialTime]);

  const startTimer = useCallback(() => {
    setState('running');
    
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev > 0) {
          return prev - 1;
        } else {
          setMinutes(prevMin => {
            if (prevMin > 0) {
              return prevMin - 1;
            } else {
              // Timer completed
              setState('idle');
              
              if (phase === 'focus') {
                // Switch to break
                setPhase('break');
                const breakTime = preset === '25/5' ? 5 : 15; // For 15min preset, use 15min break too
                setMinutes(breakTime);
                setSeconds(0);
              } else {
                // Switch to focus
                setPhase('focus');
                setSession(prev => prev + 1);
                const { minutes: focusMinutes } = getInitialTime('focus', preset);
                setMinutes(focusMinutes);
                setSeconds(0);
              }
              
              return 0;
            }
          });
          return 59;
        }
      });
    }, 1000);
  }, [phase, preset, getInitialTime]);

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
    setMinutes(resetMinutes);
    setSeconds(resetSeconds);
  }, [preset, getInitialTime]);

  return (
    <TimerContext.Provider value={{
      minutes,
      seconds,
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