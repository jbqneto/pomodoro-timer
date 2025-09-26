"use client";

import { useTimer } from "@/context/TimerContext";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef } from "react";

export function Timer() {
  const { minutes, seconds, phase, session } = useTimer();
  const { t } = useLanguage();

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseMessage = () => {
    return phase === 'focus' ? t('timeToFocus') : t('timeForBreak');
  };
  
  const onVisibilityChange = () => {
      setTimeout(() => {
        console.log('Visibility changed to:' + document.visibilityState);
      }, 500);
      
      if (document.visibilityState === 'visible') {
        
      }
  }

  useEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  return (
    <div className="text-center">
      {/* Session counter */}
      <div className="text-muted-foreground text-base mb-6 font-light">
        {t('session')}{session}
      </div>
      
      {/* Main timer display */}
      <div className="text-7xl md:text-8xl font-light text-foreground mb-8 font-mono tracking-wider">
        {formatTime(minutes, seconds)}
      </div>
      
      {/* Phase indicator */}
      <div className="space-y-4">
        <div className={`inline-block px-8 py-3 rounded-full text-base font-medium transition-colors ${
          phase === 'focus' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary text-secondary-foreground'
        }`}>
          {phase === 'focus' ? t('focus') : t('break')}
        </div>
        
        <div className="text-muted-foreground text-lg font-light">
          {getPhaseMessage()}
        </div>
      </div>
      
    </div>
  );
}