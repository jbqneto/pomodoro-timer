"use client";

import { useTimer } from "@/context/TimerContext";
import { useLanguage } from "@/context/LanguageContext";
import { Clock3, Coffee } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Timer() {
  const { minutes, seconds, phase, session } = useTimer();
  const { t } = useLanguage();
  const isFocus = phase === "focus";
  const slothImage = isFocus ? "/imgs/sloth_focus.png" : "/imgs/sloth_break.png";
  const slothAlt = isFocus
    ? "Sloth wearing headphones and focusing at a laptop"
    : "Sloth wearing headphones taking a break with a mug";

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TooltipProvider delayDuration={120}>
      <div className="text-center">
        <div className="grid w-full grid-cols-[3rem_minmax(0,1fr)_5.5rem] items-start gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors ${
                  isFocus
                    ? "border-sky-400/20 bg-sky-400/10 text-sky-300"
                    : "border-amber-300/25 bg-amber-300/10 text-amber-200"
                }`}
                aria-label={isFocus ? t("focus") : t("break")}
              >
                {isFocus ? <Clock3 className="h-5 w-5" /> : <Coffee className="h-5 w-5" />}
              </div>
            </TooltipTrigger>
            <TooltipContent className="border-white/10 bg-neutral-900 text-neutral-100">
              {isFocus ? t("focus") : t("break")}
            </TooltipContent>
          </Tooltip>

          <div className="min-w-0 justify-self-center pt-2 text-base font-semibold text-neutral-100 sm:text-lg">
            {t('session')}{session}
          </div>

          <div
            className={`justify-self-end rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
              isFocus
                ? "border-sky-300/20 bg-sky-400/10 text-sky-200"
                : "border-amber-300/25 bg-amber-300/10 text-amber-100"
            }`}
          >
            {isFocus ? t("focus") : t("break")}
          </div>
        </div>

        <div className="relative mx-auto mt-3 flex h-36 w-full items-center justify-center sm:h-40">
          <img
            src={slothImage}
            alt={slothAlt}
            width={320}
            height={320}
            className={`h-full w-auto max-w-[76%] object-contain ${
              isFocus
                ? "drop-shadow-[0_22px_34px_rgba(14,165,233,0.12)]"
                : "drop-shadow-[0_22px_34px_rgba(251,191,36,0.12)]"
            }`}
          />
        </div>

        <div
          className={`mt-2 font-mono text-7xl font-light leading-none tracking-wider md:text-8xl ${
            isFocus
              ? "text-sky-50 [text-shadow:0_0_24px_rgba(56,189,248,0.12)]"
              : "text-amber-50 [text-shadow:0_0_24px_rgba(251,191,36,0.12)]"
          }`}
        >
          {formatTime(minutes, seconds)}
        </div>
      </div>
    </TooltipProvider>
  );
}
