"use client";

import { useTimer } from "@/context/TimerContext";
import { Timer } from "../Timer";
import { Controls } from "./Controls";

export default function TimerCard() {
  const { phase } = useTimer();
  return (
    <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6 text-center">
      <p className="text-xs uppercase tracking-widest text-neutral-400">Sessão #1</p>

      <div className="mt-3 text-7xl font-bold [font-variant-numeric:tabular-nums]">
        <Timer />
      </div>

      <span className="mt-4 inline-block rounded-full bg-sky-500/90 px-3 py-1 text-sm font-semibold text-white">
        {phase === "focus" ? "Foco" : phase === "break" ? "Pausa" : "Pronto"}
      </span>

      <p className="mt-2 text-neutral-300">
        {phase === "focus" ? "Hora de focar!" : phase === "break" ? "Respire e descanse." : "Clique para começar."}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Controls />
      </div>
    </div>
  );
}
