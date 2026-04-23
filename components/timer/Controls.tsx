"use client";

import { useTimer } from "@/context/TimerContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, RotateCcw } from "lucide-react";

export function Controls() {
  const { state, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();
  const { t } = useLanguage();

  return (
    <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
      {state === 'idle' && (
        <Button
          onClick={startTimer}
          size="lg"
          className="h-[3.25rem] min-h-[3.25rem] w-full rounded-full bg-sky-500 px-12 py-4 text-base font-semibold tracking-[0.08em] text-white shadow-[0_16px_36px_-20px_rgba(14,165,233,0.9)] transition-all duration-200 hover:-translate-y-px hover:bg-sky-400 active:translate-y-0 focus-ring sm:max-w-72"
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
            className="h-12 flex-1 rounded-full bg-white/10 px-8 py-4 text-base font-semibold text-neutral-100 transition-all duration-200 hover:-translate-y-px hover:bg-white/15 active:translate-y-0 focus-ring"
          >
            <Pause className="w-5 h-5 mr-2" />
            {t('pause')}
          </Button>
          
          <Button
          onClick={stopTimer}
          size="lg"
          variant="destructive"
            className="h-12 flex-1 rounded-full border border-white/10 bg-rose-500/15 px-8 py-4 text-base font-semibold text-rose-100 transition-all duration-200 hover:-translate-y-px hover:bg-rose-500/25 active:translate-y-0 focus-ring"
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
          className="h-12 flex-1 rounded-full bg-sky-500 px-8 py-4 text-base font-semibold tracking-[0.08em] text-white transition-all duration-200 hover:-translate-y-px hover:bg-sky-400 active:translate-y-0 focus-ring"
        >
          <Play className="w-5 h-5 mr-2" />
          {t('resume')}
          </Button>
          
          <Button
          onClick={stopTimer}
          size="lg"
          variant="outline"
          className="h-12 flex-1 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-neutral-100 transition-all duration-200 hover:-translate-y-px hover:bg-white/10 active:translate-y-0 focus-ring"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
            {t('stop')}
          </Button>
        </>
      )}
    </div>
  );
}
