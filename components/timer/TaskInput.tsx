"use client";

import { Check, ListTodo, Pencil } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTimer } from "@/context/TimerContext";

export function TaskInput() {
  const { task, setTask, isTaskLocked, setTaskLocked } = useTimer();
  const { t } = useLanguage();
  const hasTask = task.trim().length > 0;

  return (
    <label className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left transition focus-within:border-sky-400/50 focus-within:ring-2 focus-within:ring-sky-400/15">
      <ListTodo className="h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
      <input
        value={task}
        onChange={(event) => setTask(event.target.value)}
        disabled={isTaskLocked}
        maxLength={160}
        className="min-w-0 flex-1 bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-500 disabled:cursor-default disabled:text-neutral-300"
        placeholder={t("taskPlaceholder")}
        aria-label={t("currentTask")}
      />
      {hasTask ? (
        <button
          type="button"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-400 text-neutral-950 transition-all duration-200 hover:bg-sky-300 focus-ring"
          onClick={() => setTaskLocked(!isTaskLocked)}
          aria-label={isTaskLocked ? t("editTask") : t("saveTask")}
          title={isTaskLocked ? t("editTask") : t("saveTask")}
        >
          {isTaskLocked ? <Pencil className="h-3.5 w-3.5" /> : <Check className="h-4 w-4" />}
        </button>
      ) : null}
    </label>
  );
}
