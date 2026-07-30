"use client";

import { useTimer } from "@/context/TimerContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function Controls() {
  const { state, startTimer, pauseTimer, resumeTimer, restartPhase, abandonCycle } = useTimer();
  const { t } = useLanguage();
  const primary = state === "idle" ? startTimer : state === "running" ? pauseTimer : resumeTimer;
  const primaryLabel = state === "idle" ? t("start") : state === "running" ? t("pause") : t("resume");

  return <div className="flex w-full flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
    <Button onClick={primary} size="lg" className="h-12 flex-1 rounded-full bg-sky-500 px-8 text-base font-semibold text-white hover:bg-sky-400 focus-ring">
      {state === "running" ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}{primaryLabel}
    </Button>
    <Button onClick={restartPhase} size="lg" variant="outline" className="h-12 flex-1 rounded-full border-white/10 bg-white/5 text-neutral-100 hover:bg-white/10 focus-ring">
      <RotateCcw className="mr-2 h-5 w-5" />{t("restartPhase")}
    </Button>
    <AlertDialog>
      <AlertDialogTrigger asChild><Button size="lg" variant="destructive" className="h-12 flex-1 rounded-full border border-white/10 bg-rose-500/15 text-rose-100 hover:bg-rose-500/25 focus-ring"><Trash2 className="mr-2 h-5 w-5" />{t("abandonCycle")}</Button></AlertDialogTrigger>
      <AlertDialogContent className="border-white/10 bg-neutral-900 text-neutral-100">
        <AlertDialogHeader><AlertDialogTitle>{t("abandonCycleTitle")}</AlertDialogTitle><AlertDialogDescription className="text-neutral-300">{t("abandonCycleDescription")}</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>{t("cancel")}</AlertDialogCancel><AlertDialogAction onClick={abandonCycle} className="bg-rose-600 hover:bg-rose-500">{t("abandonCycle")}</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>;
}
