"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import YouTubePlayer, { YoutubePlayerRef } from "../YouTubePlayer";
import { useLanguage } from "@/context/LanguageContext";
import { useConfig } from "@/context/ConfigContext";
import { ChevronDown, Maximize2, Minimize2, Music4, Pause, Play, Volume2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const YOUTUBE_CONSENT_KEY = "youtube-media-consent";
const PLAYLIST_OPTIONS: PlaylistType[] = ["catholic", "lofi", "classical"];

export default function MusicMiniCard() {
  const { t } = useLanguage();
  const { activePlaylist, soundVolume, setActivePlaylist, setSoundVolume } = useConfig();
  const playerRef = useRef<YoutubePlayerRef>(null);
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [consent, setConsent] = useState<"granted" | "denied" | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);

  function updateVolume(value: number) {
    if (playerRef.current) {
      playerRef.current.setVolume(value);
    }
  }

  function handleVolumeChange(event: ChangeEvent<HTMLInputElement>): void {
    setSoundVolume(Number(event.target.value));
  }

  function handlePlaylistChange(event: ChangeEvent<HTMLSelectElement>): void {
    const nextPlaylist = event.target.value as PlaylistType;
    setActivePlaylist(nextPlaylist);
    setIsPlaying(false);
  }

  useEffect(() => {
    updateVolume(soundVolume);
  }, [soundVolume]);

  useEffect(() => {
    if (activePlaylist === null) {
      setActivePlaylist("catholic");
    }
  }, [activePlaylist, setActivePlaylist]);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(YOUTUBE_CONSENT_KEY);

    if (storedConsent === "granted" || storedConsent === "denied") {
      setConsent(storedConsent);
      return;
    }

    setShowConsentModal(true);
  }, []);

  function togglePlayback() {
    if (!playerRef.current || consent !== "granted") return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      return;
    }

    playerRef.current.playVideo();
    setIsPlaying(true);
  }

  const selectedPlaylist = activePlaylist ?? "catholic";
  const activePlaylistSubtitle = t(`${selectedPlaylist}Subtitle`);

  function updateConsent(nextConsent: "granted" | "denied") {
    window.localStorage.setItem(YOUTUBE_CONSENT_KEY, nextConsent);
    setConsent(nextConsent);
    setShowConsentModal(false);

    if (nextConsent === "denied") {
      setIsPlaying(false);
    }
  }

  return (
    <TooltipProvider delayDuration={120}>
      <Card className="overflow-hidden rounded-3xl border-white/10 bg-neutral-900/80 shadow-[0_18px_45px_-24px_rgba(14,165,233,0.28)]">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%)]" />

          <div className="relative flex flex-col items-center justify-center gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5">
            <div className="grid w-full grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-300/15 bg-sky-400/10 text-sky-300 shadow-[0_0_24px_-14px_rgba(56,189,248,0.9)]">
                <Music4 className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <label htmlFor="music-category" className="sr-only">
                  {t("musicCategory")}
                </label>
                <div className="group relative rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-px shadow-[0_14px_32px_-22px_rgba(56,189,248,0.8)]">
                  <select
                    id="music-category"
                    value={selectedPlaylist}
                    onChange={handlePlaylistChange}
                    className="h-11 w-full appearance-none rounded-[15px] border border-white/10 bg-neutral-950/90 px-4 pr-11 text-sm font-semibold text-neutral-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] outline-none transition-all duration-200 hover:border-sky-300/35 hover:bg-neutral-950 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-400/35"
                  >
                    {PLAYLIST_OPTIONS.map((playlist) => (
                      <option key={playlist} value={playlist} className="bg-neutral-950 text-neutral-100">
                        {t(playlist)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-300 transition-transform duration-200 group-focus-within:rotate-180"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-neutral-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200 hover:-translate-y-px hover:border-sky-300/30 hover:bg-white/10 hover:text-white focus-ring"
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
              <div className="rounded-[26px] border border-white/10 bg-neutral-950/80 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-4">
                <div className="mb-3 flex items-center justify-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/75" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>

                <div className="mx-auto overflow-hidden rounded-2xl border border-white/10 bg-black/35">
                  {consent === "granted" ? (
                    <YouTubePlayer ref={playerRef} onPlaybackStateChange={setIsPlaying} />
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center gap-4 px-6 text-center">
                      <p className="max-w-xs text-sm leading-6 text-neutral-300">
                        {t("youtubeConsentInline")}
                      </p>
                      <button
                        type="button"
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 focus-ring"
                        onClick={() => setShowConsentModal(true)}
                      >
                        {t("youtubeConsentReview")}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-col gap-1 px-1 text-center">
                  <p className="text-sm font-semibold text-neutral-100">{t("musicSessionLabel")}</p>
                  <p className="text-xs leading-5 text-neutral-400">{activePlaylistSubtitle}</p>
                </div>
              </div>
            </div>

            <div className="flex w-full max-w-xl items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-full sm:px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-white transition-all duration-200 hover:-translate-y-px hover:bg-sky-400 focus-ring disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400 disabled:hover:translate-y-0"
                    onClick={togglePlayback}
                    aria-pressed={isPlaying}
                    aria-label={isPlaying ? t("pauseVideo") : t("playVideo")}
                    disabled={consent !== "granted"}
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
                <span className="hidden text-xs font-medium uppercase tracking-[0.24em] text-neutral-500 sm:inline">
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

      {showConsentModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-[0_24px_70px_-28px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
                <Music4 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{t("youtubeConsentTitle")}</h2>
                <p className="text-sm text-neutral-400">{t("youtubeConsentSubtitle")}</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-neutral-300">
              {t("youtubeConsentBody")}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-neutral-100 transition-all duration-200 hover:bg-white/10 focus-ring"
                onClick={() => updateConsent("denied")}
              >
                {t("youtubeConsentDecline")}
              </button>
              <button
                type="button"
                className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-sky-400 focus-ring"
                onClick={() => updateConsent("granted")}
              >
                {t("youtubeConsentAccept")}
              </button>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
