"use client";

import { useTimer } from "@/context/TimerContext";
import { Timer } from "../Timer";
import { Controls } from "./Controls";

export default function TimerCard() {
  const { phase } = useTimer();
  return (
    <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6 text-center">
      <div className="mt-3 text-7xl font-bold [font-variant-numeric:tabular-nums]">
        <Timer />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Controls />
      </div>
    </div>
  );
}
