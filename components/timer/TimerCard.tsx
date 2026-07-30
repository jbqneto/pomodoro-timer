"use client";

import { useTimer } from "@/context/TimerContext";
import { Timer } from "../Timer";
import { Controls } from "./Controls";
import MusicMiniCard from "../music/MusicMiniCard";
import { TaskInput } from "./TaskInput";
import { BreakTip } from "./BreakTip";
import { useConfig } from "@/context/ConfigContext";

export default function TimerCard() {
  const { phase, session } = useTimer();
  const { showBreakTips, interfaceMode } = useConfig();
  const isFocus = phase === "focus";

  return (
    <section
      className={`relative w-full overflow-hidden rounded-3xl border p-4 text-center shadow-[0_24px_70px_-36px_rgba(0,0,0,0.85)] sm:p-6 ${
        isFocus
          ? "border-sky-300/20 bg-neutral-950/80"
          : "border-amber-300/20 bg-neutral-950/80"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${
          isFocus
            ? "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.045),transparent_38%)]"
            : "bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.045),transparent_38%)]"
        }`}
      />

      <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1.16fr)_minmax(19rem,0.84fr)] lg:items-stretch lg:gap-0">
        <div className="min-w-0 lg:border-r lg:border-white/10 lg:pr-7">
          <MusicMiniCard showTrackNavigation={interfaceMode !== "simple"} />
        </div>

        <div className="flex min-w-0 flex-col lg:pl-7">
          <div className="mx-auto w-full max-w-md">
            <Timer />
          </div>

          <div className="mx-auto mt-auto w-full max-w-md pt-4">
            {!isFocus && showBreakTips ? <BreakTip sessionNumber={session} /> : <TaskInput />}
            <div className="mt-3">
              <Controls />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
