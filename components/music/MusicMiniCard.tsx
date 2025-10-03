"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import YouTubePlayer, { YoutubePlayerRef } from "../YouTubePlayer";

export default function MusicMiniCard() {
  const playerRef = useRef<YoutubePlayerRef>(null);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(80);

  function updateVolume(value: number) {
    if (playerRef.current) {
      playerRef.current.setVolume(value);
    }
  }

  function handleVolumeChange(event: ChangeEvent<HTMLInputElement>): void {
    setVolume(Number(event.target.value));
  }

  function handlePlayToggle(event: any): void {
    event.preventDefault();
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  }

  useEffect(() => {
    updateVolume(volume);
  }, [volume]);

  return (
<Card>
<div className="flex flex-wrap items-start gap-4">
  <div
    className={
      expanded
        ? "order-3 w-full aspect-video overflow-hidden rounded-2xl"
        : "order-1 w-[160px] h-[90px] overflow-hidden rounded-lg"
    }
  >
    <div className="relative h-full w-full">
      <YouTubePlayer ref={playerRef}/>
    </div>
  </div>

  <div className={expanded ? 'order-3 w-full self-center' : 'order-2 min-w-[220px] flex-1'}>
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {/** TODO: Later
      <button onClick={handlePlayToggle} className="btn-primary">▶ Play</button>
       */}
      <button onClick={() => {setVolume(0)}} className="chip">🔈 Mute</button>
      <div className="ml-2 flex items-center gap-2">
        <span className="text-xs text-neutral-400">Vol</span>
        <input value={volume} onChange={handleVolumeChange} type="range" min={0} max={100}
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
