"use client";

import { useState } from "react";
import { YouTubePlayer } from "../YouTubePlayer";
import { Card } from "../ui/card";

export default function MusicMiniCard() {
  const [expanded, setExpanded] = useState(false);

  return (
<Card>
<div className="flex flex-wrap items-start gap-4">
  <div
    className={
      expanded
        ? // EXPANDIDO → vai para a LINHA DE BAIXO e ocupa 100% com 16:9
          "order-3 w-full aspect-video overflow-hidden rounded-2xl"
        : // COLAPSADO → fica na ESQUERDA com 160x90 fixo
          "order-1 w-[160px] h-[90px] overflow-hidden rounded-lg"
    }
  >
    <div className="relative h-full w-full">
      <YouTubePlayer />
    </div>
  </div>

  <div className={expanded ? 'order-3 w-full self-center' : 'order-2 min-w-[220px] flex-1'}>
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <button className="btn-primary">▶ Play</button>
      <button className="chip">🔈 Mute</button>
      <div className="ml-2 flex items-center gap-2">
        <span className="text-xs text-neutral-400">Vol</span>
        <input type="range" min={0} max={100} defaultValue={80}
               className="h-1 w-28 appearance-none rounded bg-white/10 accent-sky-400" />
      </div>
    </div>
  </div>

  {/* RIGHT: botão Expand (fixo à direita; não encolhe) */}
  <div className="order-3 ml-auto flex-shrink-0 mt-10">
    <button
      className="btn"
      onClick={() => setExpanded((s) => !s)}
      aria-expanded={expanded}
    >
      {expanded ? "Collapse player" : "Expand player"}
    </button>
  </div>
</div>
</Card>

  );
}
