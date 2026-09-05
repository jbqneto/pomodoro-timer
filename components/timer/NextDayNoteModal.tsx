"use client";

import { useTimer } from "@/context/TimerContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

interface NextDayNoteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export function NextDayNoteModal({ isOpen, onConfirm }: NextDayNoteModalProps) {
  const { nextDayNote } = useTimer();
  const { t } = useLanguage();

  if (!isOpen || !nextDayNote) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-6 shadow-[0_24px_70px_-36px_rgba(0,0,0,0.85)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-100">{t("nextDayNoteTitle")}</h2>
        </div>

        <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-4 mb-6">
          <p className="text-neutral-300 whitespace-pre-wrap">{nextDayNote}</p>
        </div>

        <Button
          onClick={onConfirm}
          className="w-full bg-sky-500 hover:bg-sky-400"
        >
          {t("nextDayNoteConfirm")}
        </Button>
      </div>
    </div>
  );
}