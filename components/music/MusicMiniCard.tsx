"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import YouTubePlayer, { YoutubePlayerRef } from "../YouTubePlayer";
import { useLanguage } from "@/context/LanguageContext";
import { useConfig } from "@/context/ConfigContext";
import { useTimer } from "@/context/TimerContext";
import { getMusicOptions, getMusicSource } from "@/core/music/music.catalog";
import { MusicOptionId, MusicSource } from "@/core/music/music.types";
import { parseYouTubeUrl } from "@/core/music/youtube-url";
import { ChevronDown, Music4, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

const YOUTUBE_CONSENT_KEY = "youtube-media-consent";
const MUSIC_OPTIONS = getMusicOptions();

export default function MusicMiniCard({ showTrackNavigation = true }: { showTrackNavigation?: boolean }) {
  const { t } = useLanguage();
  const { activePlaylist, customMusicSource, musicVolume, autoPlay, setActivePlaylist, setCustomMusicSource, setMusicVolume } = useConfig();
  const { state: timerState } = useTimer();
  const playerRef = useRef<YoutubePlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [consent, setConsent] = useState<"granted" | "denied" | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showCustomPlaylistModal, setShowCustomPlaylistModal] = useState(false);
  const [customPlaylistUrl, setCustomPlaylistUrl] = useState("");
  const [customPlaylistError, setCustomPlaylistError] = useState("");

  function handleVolumeChange(event: ChangeEvent<HTMLInputElement>): void {
    setMusicVolume(Number(event.target.value));
  }

  function handlePlaylistChange(event: ChangeEvent<HTMLSelectElement>): void {
    const nextPlaylist = event.target.value as MusicOptionId;
    if (nextPlaylist === 'custom') {
      setCustomPlaylistUrl("");
      setCustomPlaylistError("");
      setShowCustomPlaylistModal(true);
      return;
    }
    setActivePlaylist(nextPlaylist);
    setIsPlaying(false);
  }

  function saveCustomPlaylist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const source = parseYouTubeUrl(customPlaylistUrl);
    if (!source) {
      setCustomPlaylistError(t("customPlaylistInvalidUrl"));
      return;
    }

    setCustomMusicSource(source);
    setActivePlaylist('custom');
    setIsPlaying(false);
    setShowCustomPlaylistModal(false);
  }

  useEffect(() => {
    playerRef.current?.setVolume(musicVolume);
  }, [musicVolume]);

  useEffect(() => {
    const source = activePlaylist === 'custom' ? customMusicSource : getMusicSource(activePlaylist);
    if (!source || source.type === 'silence') return;
    const storedConsent = window.localStorage.getItem(YOUTUBE_CONSENT_KEY);

    if (storedConsent === "granted" || storedConsent === "denied") {
      setConsent(storedConsent);
      return;
    }

    setShowConsentModal(true);
  }, [activePlaylist, customMusicSource]);

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

  const selectedSource: MusicSource = activePlaylist === 'custom'
    ? customMusicSource ?? { type: 'silence' }
    : getMusicSource(activePlaylist);
  const hasYouTubeSource = selectedSource.type !== 'silence';
  const controlsDisabled = !hasYouTubeSource || consent !== 'granted';
  const canNavigateTracks = selectedSource.type === 'youtube-playlist';

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
                value={activePlaylist}
                onChange={handlePlaylistChange}
                className="h-11 w-full appearance-none rounded-[15px] border border-white/10 bg-neutral-950/90 px-4 pr-11 text-sm font-semibold text-neutral-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] outline-none transition-all duration-200 hover:border-sky-300/35 hover:bg-neutral-950 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-400/35"
              >
                {MUSIC_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id} className="bg-neutral-950 text-neutral-100">
                    {t(option.id)}
                  </option>
                ))}
                <option value="custom" className="bg-neutral-950 text-neutral-100">{t("customPlaylist")}</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-300 transition-transform duration-200 group-focus-within:rotate-180"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/35 shadow-[0_18px_38px_-28px_rgba(14,165,233,0.65)]">
          {!hasYouTubeSource ? (
            <div className="aspect-video" />
          ) : consent === "granted" ? (
            <YouTubePlayer ref={playerRef} source={selectedSource} volume={musicVolume}
              shouldPlay={timerState === 'running' && autoPlay} onPlaybackStateChange={setIsPlaying} />
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
          {showTrackNavigation && <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-100 transition-all duration-200 hover:-translate-y-px hover:bg-white/10 focus-ring disabled:cursor-not-allowed disabled:text-neutral-500 disabled:hover:translate-y-0 disabled:hover:bg-white/5"
                onClick={playPreviousTrack}
                aria-label={t("previousTrack")}
                disabled={controlsDisabled || !canNavigateTracks}
              >
                <SkipBack className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="border-white/10 bg-neutral-900 text-neutral-100">
              {t("previousTrack")}
            </TooltipContent>
          </Tooltip>}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-white transition-all duration-200 hover:-translate-y-px hover:bg-sky-400 focus-ring disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400 disabled:hover:translate-y-0"
                onClick={togglePlayback}
                aria-pressed={isPlaying}
                aria-label={isPlaying ? t("pauseVideo") : t("playVideo")}
                disabled={controlsDisabled}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent className="border-white/10 bg-neutral-900 text-neutral-100">
              {isPlaying ? t("pauseVideo") : t("playVideo")}
            </TooltipContent>
          </Tooltip>

          {showTrackNavigation && <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-100 transition-all duration-200 hover:-translate-y-px hover:bg-white/10 focus-ring disabled:cursor-not-allowed disabled:text-neutral-500 disabled:hover:translate-y-0 disabled:hover:bg-white/5"
                onClick={playNextTrack}
                aria-label={t("nextTrack")}
                disabled={controlsDisabled || !canNavigateTracks}
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="border-white/10 bg-neutral-900 text-neutral-100">
              {t("nextTrack")}
            </TooltipContent>
          </Tooltip>}

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
              aria-label={t("volume")}
              className="h-1.5 w-full appearance-none rounded-full bg-white/10 accent-sky-400"
            />
          </div>

          <span className="w-10 text-right text-sm font-medium tabular-nums text-neutral-300">
            {musicVolume}
          </span>
        </div>

      </section>

      {hasYouTubeSource && showConsentModal && (
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
          </div>
        </div>
      )}

      <Dialog open={showCustomPlaylistModal} onOpenChange={setShowCustomPlaylistModal}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg border-white/10 bg-neutral-900 text-neutral-100">
          <DialogHeader>
            <DialogTitle>{t("customPlaylistTitle")}</DialogTitle>
            <DialogDescription className="text-neutral-400">{t("customPlaylistDescription")}</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={saveCustomPlaylist}>
            <label className="block space-y-2 text-sm font-medium text-neutral-200" htmlFor="custom-youtube-url">
              {t("customPlaylistUrl")}
              <input
                id="custom-youtube-url"
                autoFocus
                type="url"
                value={customPlaylistUrl}
                onChange={(event) => { setCustomPlaylistUrl(event.target.value); setCustomPlaylistError(""); }}
                placeholder={t("customPlaylistPlaceholder")}
                className="h-11 w-full rounded-xl border border-white/10 bg-neutral-950 px-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-sky-300/70 focus:ring-2 focus:ring-sky-400/35"
              />
            </label>
            {customPlaylistError && <p role="alert" className="text-sm text-rose-300">{customPlaylistError}</p>}
            <button type="submit" className="w-full rounded-xl bg-sky-500 px-4 py-2 font-semibold text-white hover:bg-sky-400 focus-ring">
              {t("saveCustomPlaylist")}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
