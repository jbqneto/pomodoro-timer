"use client";

import { useTimer } from "@/context/TimerContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, RotateCcw } from "lucide-react";

export function Controls() {
  const { state, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();
  const { t } = useLanguage();

  return (
    <div className="flex justify-center gap-6">
      {state === 'idle' && (
        <Button
          onClick={startTimer}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-4 text-base font-medium rounded-full min-w-36 focus-ring transition-all duration-200"
        >
          <Play className="w-5 h-5 mr-2" />
          {t('start')}
        </Button>
      )}
      
      {state === 'running' && (
        <>
          <Button
            onClick={pauseTimer}
            size="lg"
            variant="secondary"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-10 py-4 text-base font-medium rounded-full focus-ring transition-all duration-200"
          >
            <Pause className="w-5 h-5 mr-2" />
            {t('pause')}
          </Button>
          
          <Button
            onClick={stopTimer}
            size="lg"
            variant="destructive"
            className="border-border hover:bg-muted px-8 py-4 text-base font-medium rounded-full focus-ring transition-all duration-200"
          >
            <Square className="w-5 h-5 mr-2" />
            {t('stop')}
          </Button>
        </>
      )}
      
      {state === 'paused' && (
        <>
          <Button
            onClick={resumeTimer}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-4 text-base font-medium rounded-full focus-ring transition-all duration-200"
          >
            <Play className="w-5 h-5 mr-2" />
            {t('resume')}
          </Button>
          
          <Button
            onClick={stopTimer}
            size="lg"
            variant="outline"
            className="border-border hover:bg-muted px-8 py-4 text-base font-medium rounded-full focus-ring transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t('stop')}
          </Button>
        </>
      )}
    </div>
  );
}