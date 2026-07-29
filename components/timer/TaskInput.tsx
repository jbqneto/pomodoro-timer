"use client";

import { ListTodo } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTimer } from "@/context/TimerContext";

export function TaskInput() {
  const { task, setTask } = useTimer();
  const { t } = useLanguage();

  return (
    <label className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left transition focus-within:border-sky-400/50 focus-within:ring-2 focus-within:ring-sky-400/15">
      <ListTodo className="h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
      <input
        value={task}
        onChange={(event) => setTask(event.target.value)}
        maxLength={160}
        className="min-w-0 flex-1 bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-500"
        placeholder={t("taskPlaceholder")}
        aria-label={t("currentTask")}
      />
    </label>
  );
}
