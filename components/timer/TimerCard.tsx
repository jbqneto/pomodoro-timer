"use client";

import { useTimer } from "@/context/TimerContext";
import { Timer } from "../Timer";
import { Controls } from "./Controls";

export default function TimerCard() {
  const { phase } = useTimer();
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

      <div className="relative mx-auto max-w-md">
        <Timer />
      </div>

      <div className="relative mx-auto mt-5 max-w-md">
        <Controls />
      </div>
    </section>
  );
}
