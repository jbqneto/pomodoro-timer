"use client";

import { useTimer } from "@/context/TimerContext";
import { useLanguage } from "@/context/LanguageContext";
import { Clock3, Coffee } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Timer() {
  const { minutes, seconds, phase, session } = useTimer();
  const { t } = useLanguage();

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TooltipProvider delayDuration={120}>
      <div className="text-center">
        <div className="mb-6 flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors ${
                  phase === "focus"
                    ? "border-sky-400/20 bg-sky-400/10 text-sky-300"
                    : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                }`}
                aria-label={phase === "focus" ? t("focus") : t("break")}
              >
                {phase === "focus" ? <Clock3 className="h-5 w-5" /> : <Coffee className="h-5 w-5" />}
              </div>
            </TooltipTrigger>
            <TooltipContent className="border-white/10 bg-neutral-900 text-neutral-100">
              {phase === "focus" ? t("focus") : t("break")}
            </TooltipContent>
          </Tooltip>

          <div className="text-muted-foreground text-base font-light">
            {t('session')}{session}
          </div>

          <div className="h-11 w-11" aria-hidden="true" />
        </div>

        <div
          className={`mb-2 text-7xl font-light font-mono tracking-wider md:text-8xl ${
            phase === "focus"
              ? "text-sky-50 [text-shadow:0_0_24px_rgba(56,189,248,0.12)]"
              : "text-emerald-200 [text-shadow:0_0_24px_rgba(52,211,153,0.12)]"
          }`}
        >
          {formatTime(minutes, seconds)}
        </div>
      </div>
    </TooltipProvider>
  );
}
