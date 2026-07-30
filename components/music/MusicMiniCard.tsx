"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import YouTubePlayer, { YoutubePlayerRef } from "../YouTubePlayer";
import { useLanguage } from "@/context/LanguageContext";
import { useConfig } from "@/context/ConfigContext";
import { ChevronDown, Music4, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import type { PlaylistType } from "@/context/ConfigContext";

const YOUTUBE_CONSENT_KEY = "youtube-media-consent";
const PLAYLIST_OPTIONS: PlaylistType[] = ["silence", "gregorian", "lofi", "classical"];

export default function MusicMiniCard() {
  const { t } = useLanguage();
  const { activePlaylist, musicVolume, setActivePlaylist, setMusicVolume } = useConfig();
  const playerRef = useRef<YoutubePlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [consent, setConsent] = useState<"granted" | "denied" | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);

  function handleVolumeChange(event: ChangeEvent<HTMLInputElement>): void {
    setMusicVolume(Number(event.target.value));
  }

  function handlePlaylistChange(event: ChangeEvent<HTMLSelectElement>): void {
    const playlist = event.target.value as PlaylistType;
    if (playlist === "silence") playerRef.current?.stopVideo();
    setActivePlaylist(playlist);
    setIsPlaying(false);
  }

  useEffect(() => {
    playerRef.current?.setVolume(musicVolume);
  }, [musicVolume]);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(YOUTUBE_CONSENT_KEY);

    if (storedConsent === "granted" || storedConsent === "denied") {
      setConsent(storedConsent);
      return;
    }

    if (activePlaylist !== "silence") setShowConsentModal(true);
  }, [activePlaylist]);

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

  function playPreviousTrack() {
    if (consent !== "granted") return;
    playerRef.current?.previousVideo();
  }

  function playNextTrack() {
    if (consent !== "granted") return;
    playerRef.current?.nextVideo();
  }

  function updateConsent(nextConsent: "granted" | "denied") {
    window.localStorage.setItem(YOUTUBE_CONSENT_KEY, nextConsent);
    setConsent(nextConsent);
    setShowConsentModal(false);

    if (nextConsent === "denied") {
      setIsPlaying(false);
    }
  }

  const selectedPlaylist = activePlaylist;
  const playerDisabled = consent !== "granted" || activePlaylist === "silence";

  return (
    <TooltipProvider delayDuration={120}>
      <section aria-label={t("musicSessionLabel")} className="flex h-full flex-col">
        <div className="grid w-full grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-3">
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
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/35 shadow-[0_18px_38px_-28px_rgba(14,165,233,0.65)]">
          {activePlaylist === "silence" ? (
            <div className="flex aspect-video items-center justify-center px-6 text-sm text-neutral-300">{t("silenceDescription")}</div>
          ) : consent === "granted" ? (
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

        <div className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-full sm:px-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-100 transition-all duration-200 hover:-translate-y-px hover:bg-white/10 focus-ring disabled:cursor-not-allowed disabled:text-neutral-500 disabled:hover:translate-y-0 disabled:hover:bg-white/5"
                onClick={playPreviousTrack}
                aria-label={t("previousTrack")}
                disabled={playerDisabled}
              >
                <SkipBack className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="border-white/10 bg-neutral-900 text-neutral-100">
              {t("previousTrack")}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-white transition-all duration-200 hover:-translate-y-px hover:bg-sky-400 focus-ring disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400 disabled:hover:translate-y-0"
                onClick={togglePlayback}
                aria-pressed={isPlaying}
                aria-label={isPlaying ? t("pauseVideo") : t("playVideo")}
                disabled={playerDisabled}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent className="border-white/10 bg-neutral-900 text-neutral-100">
              {isPlaying ? t("pauseVideo") : t("playVideo")}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-100 transition-all duration-200 hover:-translate-y-px hover:bg-white/10 focus-ring disabled:cursor-not-allowed disabled:text-neutral-500 disabled:hover:translate-y-0 disabled:hover:bg-white/5"
                onClick={playNextTrack}
                aria-label={t("nextTrack")}
                disabled={playerDisabled}
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="border-white/10 bg-neutral-900 text-neutral-100">
              {t("nextTrack")}
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
              value={musicVolume}
              onChange={handleVolumeChange}
              type="range"
              min={0}
              max={100}
              disabled={activePlaylist === "silence"}
              aria-label={t("volume")}
              className="h-1.5 w-full appearance-none rounded-full bg-white/10 accent-sky-400"
            />
          </div>

          <span className="w-10 text-right text-sm font-medium tabular-nums text-neutral-300">
            {musicVolume}
          </span>
        </div>

      </section>

      <Dialog open={showConsentModal && activePlaylist !== "silence"} onOpenChange={setShowConsentModal}>
          <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-3xl border-white/10 bg-neutral-900 p-6 text-neutral-100 shadow-[0_24px_70px_-28px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
                <Music4 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-white">{t("youtubeConsentTitle")}</DialogTitle>
                <DialogDescription className="text-sm text-neutral-400">{t("youtubeConsentSubtitle")}</DialogDescription>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-neutral-300">{t("youtubeConsentBody")}</p>

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
          </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
