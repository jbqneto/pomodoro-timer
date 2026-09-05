"use client";

import { useTimer } from "@/context/TimerContext";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface EndDayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EndDayModal({ isOpen, onClose }: EndDayModalProps) {
  const { sessionHistory, task, endDay, phase, session } = useTimer();
  const { t } = useLanguage();
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const focusSessions = sessionHistory.filter((s) => s.phase === "focus");
  const breakSessions = sessionHistory.filter((s) => s.phase === "break");

  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalBreakMinutes = breakSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    endDay(note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-6 shadow-[0_24px_70px_-36px_rgba(0,0,0,0.85)]">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-neutral-100">{t("endDayTitle")}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-neutral-900 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-400">{t("endDayWorkTime")}</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-sky-400">{formatTime(totalFocusMinutes)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-neutral-900 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-400">{t("endDayBreakTime")}</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-amber-400">{formatTime(totalBreakMinutes)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-neutral-900 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-400">{t("endDaySessionsCompleted")}</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-neutral-100">{sessionHistory.length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-neutral-900 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-400">{t("endDayTasksCompleted")}</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-neutral-100">{focusSessions.length}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">{t("endDayNoteLabel")}</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("endDayNotePlaceholder")}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-neutral-900 p-3 text-neutral-100 placeholder-neutral-500 focus:border-sky-400/50 focus:outline-none focus:ring-1 focus:ring-sky-400/50 resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            {t("endDayCancel")}
          </Button>
          <Button
            type="submit"
            form="end-day-form"
            className="flex-1 bg-sky-500 hover:bg-sky-400"
          >
            {t("endDaySave")}
          </Button>
        </div>

        <form id="end-day-form" onSubmit={handleSubmit} className="hidden" />
      </div>
    </div>
  );
}