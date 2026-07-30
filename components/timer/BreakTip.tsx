"use client";

import { Coffee } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getBreakTipKey } from "@/core/timer/break-tips";

export function BreakTip({ sessionNumber }: { sessionNumber: number }) {
  const { t } = useLanguage();
  const title = t("breakTipTitle");
  const tip = t(getBreakTipKey(sessionNumber));

  return (
    <div
      role="note"
      aria-label={title}
      className="mt-5 flex min-h-14 items-center gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-2 text-left"
    >
      <Coffee className="h-4 w-4 shrink-0 text-amber-200" aria-hidden="true" />
      <div className="min-w-0">
        <div className="text-[11px] font-medium uppercase tracking-wide text-amber-200/70">{title}</div>
        <p className="text-sm leading-snug text-neutral-200">{tip}</p>
      </div>
    </div>
  );
}
