"use client";

import { Clock3, Coffee, History, PanelRightClose, PanelRightOpen, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTimer } from "@/context/TimerContext";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SessionHistorySidebar({ open, onOpenChange }: Props) {
  const { sessionHistory, sessionHistoryDate, clearSessionHistory } = useTimer();
  const { t, language } = useLanguage();

  const formattedHistoryDate = new Intl.DateTimeFormat(language === "pt" ? "pt-PT" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${sessionHistoryDate}T12:00:00`));

  const formatCompletedAt = (completedAt: string) => {
    const date = new Date(completedAt);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat(language === "pt" ? "pt-PT" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  };

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-[60] flex h-screen w-3/4 max-w-sm flex-col border-l border-sky-300/15 bg-neutral-950/95 shadow-[-18px_0_45px_-28px_rgba(0,0,0,0.95)] backdrop-blur transition-transform duration-300 ease-out md:max-w-none md:translate-x-0 md:transition-[width] ${
        open ? "translate-x-0 md:w-80" : "translate-x-full md:w-[3.75rem]"
      }`}
      aria-label={t("sessionHistory")}
    >
      <div className={`flex h-16 shrink-0 items-center border-b border-white/10 ${open ? "justify-between px-4" : "justify-center"}`}>
        {open && (
          <h2 className="text-sm font-semibold tracking-wide text-neutral-100">
            {t("sessionHistory")} - {formattedHistoryDate}
          </h2>
        )}
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl text-sky-200 transition hover:bg-sky-400/10 hover:text-sky-100 focus-ring"
          onClick={() => onOpenChange(!open)}
          aria-label={open ? t("collapseHistory") : t("expandHistory")}
          aria-expanded={open}
        >
          {open ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">{t("completedSessions")}</p>
              {sessionHistory.length > 0 && (
                <button
                  type="button"
                  onClick={clearSessionHistory}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-neutral-400 transition hover:bg-rose-500/10 hover:text-rose-200 focus-ring"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t("clearHistory")}
                </button>
              )}
            </div>

            <div className="session-history-scroll min-h-0 flex-1 overflow-y-auto px-3 pb-4">
              {sessionHistory.length === 0 ? (
                <div className="mx-1 mt-2 rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm leading-6 text-neutral-500">
                  <History className="mx-auto mb-3 h-5 w-5 text-neutral-600" />
                  {t("emptyHistory")}
                </div>
              ) : (
                <ol className="space-y-2">
                  {sessionHistory.map((entry) => {
                    const isFocus = entry.phase === "focus";
                    const Icon = isFocus ? Clock3 : Coffee;

                    return (
                      <li key={entry.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                        <div className="flex items-start gap-3">
                          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                            isFocus ? "bg-sky-400/10 text-sky-300" : "bg-amber-300/10 text-amber-200"
                          }`}>
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-right text-sm">
                              <span className="shrink-0 text-neutral-400">{entry.durationMinutes} {t("minutesShort")}</span>
                            </div>
                            {entry.task && (
                              <p className="mt-1 truncate text-xs text-neutral-300" title={entry.task}>{entry.task}</p>
                            )}
                            <time className="mt-1 block text-xs text-neutral-500" dateTime={entry.completedAt}>
                              {formatCompletedAt(entry.completedAt)}
                            </time>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center gap-3 py-5">
          <History className="h-4 w-4 text-neutral-500" aria-hidden="true" />
          {sessionHistory.length > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-sky-400/15 px-1 text-[10px] font-semibold text-sky-200">
              {Math.min(sessionHistory.length, 99)}
            </span>
          )}
        </div>
      )}
    </aside>
  );
}
