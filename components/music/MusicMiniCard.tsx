"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import YouTubePlayer, { YoutubePlayerRef } from "../YouTubePlayer";
import { useLanguage } from "@/context/LanguageContext";
import { useConfig } from "@/context/ConfigContext";
import { Maximize2, Minimize2, Music4, Pause, Play, Volume2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export default function MusicMiniCard() {
  const { t } = useLanguage();
  const { activePlaylist, soundVolume, setSoundVolume } = useConfig();
  const playerRef = useRef<YoutubePlayerRef>(null);
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  function updateVolume(value: number) {
    if (playerRef.current) {
      playerRef.current.setVolume(value);
    }
  }

  function handleVolumeChange(event: ChangeEvent<HTMLInputElement>): void {
    setSoundVolume(Number(event.target.value));
  }

  useEffect(() => {
    updateVolume(soundVolume);
  }, [soundVolume]);

  function togglePlayback() {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      return;
    }

    playerRef.current.playVideo();
    setIsPlaying(true);
  }

  const activePlaylistLabel = activePlaylist ? t(activePlaylist) : t("noPlaylist");

  return (
    <TooltipProvider delayDuration={120}>
      <Card className="overflow-hidden rounded-3xl border-white/10 bg-neutral-900/80 shadow-[0_18px_45px_-24px_rgba(14,165,233,0.28)]">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%)]" />

          <div className="relative flex flex-col items-center justify-center gap-5 px-5 py-5 sm:px-6">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sky-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <Music4 className="h-5 w-5" />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                      {t("playerLabel")}
                    </p>
                  </div>
                  <p className="truncate text-sm font-medium text-neutral-100">{activePlaylistLabel}</p>
                </div>
              </div>

              <div className="hidden sm:block">
                <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-neutral-200 transition-all duration-200 hover:-translate-y-px hover:bg-white/10 hover:text-white focus-ring"
                    onClick={() => setExpanded((s) => !s)}
                    aria-expanded={expanded}
                    aria-label={expanded ? t("playerCollapse") : t("playerExpand")}
                  >
                    {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="border-white/10 bg-neutral-900 text-neutral-100">
                  {expanded ? t("playerCollapse") : t("playerExpand")}
                </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div
              className={
                expanded
                  ? "w-full"
                  : "w-full max-w-[340px]"
              }
            >
              <div className="rounded-[28px] border border-white/10 bg-neutral-950/80 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-4">
                <div className="mb-3 flex items-center justify-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/75" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>

                <div className="mx-auto overflow-hidden rounded-2xl border border-white/10 bg-black/35">
                  <YouTubePlayer ref={playerRef} onPlaybackStateChange={setIsPlaying} />
                </div>
              </div>
            </div>

            <div className="flex w-full max-w-xl items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-white transition-all duration-200 hover:-translate-y-px hover:bg-sky-400 focus-ring"
                    onClick={togglePlayback}
                    aria-pressed={isPlaying}
                    aria-label={isPlaying ? t("pauseVideo") : t("playVideo")}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="border-white/10 bg-neutral-900 text-neutral-100">
                  {isPlaying ? t("pauseVideo") : t("playVideo")}
                </TooltipContent>
              </Tooltip>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15 text-sky-300">
                <Volume2 className="h-4 w-4" />
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="text-xs font-medium uppercase tracking-[0.24em] text-neutral-500">
                  {t("volume")}
                </span>
                <input
                  value={soundVolume}
                  onChange={handleVolumeChange}
                  type="range"
                  min={0}
                  max={100}
                  aria-label={t("volume")}
                  className="h-1.5 w-full appearance-none rounded-full bg-white/10 accent-sky-400"
                />
              </div>

              <span className="w-10 text-right text-sm font-medium tabular-nums text-neutral-300">
                {soundVolume}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}
