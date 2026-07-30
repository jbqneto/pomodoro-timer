"use client";

import { useConfig } from "@/context/ConfigContext";
import { useLanguage } from "@/context/LanguageContext";
import { PresetSelector } from "../PresetSelector";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useRef } from "react";

type Props = { open: boolean; onClose: () => void };

export default function SettingsDialog({ open, onClose }: Props) {
  const { t } = useLanguage();
  const { soundEnabled, setSoundEnabled, soundVolume, setSoundVolume, musicVolume, setMusicVolume, autoPlay, setAutoPlay, activePlaylist } = useConfig();
  const silent = activePlaylist === "silence";
  const openerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, [open]);
  return <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
    <DialogContent onCloseAutoFocus={(event) => { event.preventDefault(); openerRef.current?.focus(); }} className="w-[calc(100%-2rem)] max-w-sm rounded-2xl border-white/10 bg-neutral-900 text-neutral-100" aria-describedby="settings-description">
      <DialogTitle>{t("settings")}</DialogTitle>
      <DialogDescription id="settings-description" className="text-neutral-400">{t("settingsDescription")}</DialogDescription>
      <div className="space-y-5">
        <div><label className="mb-2 block text-sm font-medium text-neutral-300">{t("timerPreset")}</label><PresetSelector /></div>
        <label className="flex items-center justify-between gap-4"><span>🔔 {t("alarm")}</span><input type="checkbox" checked={soundEnabled} onChange={(event) => setSoundEnabled(event.target.checked)} /></label>
        <div className={soundEnabled ? "" : "pointer-events-none opacity-50"}><label htmlFor="alarm-volume" className="mb-1 block text-sm text-neutral-300">{t("alarmVolume")}</label><input id="alarm-volume" type="range" min={0} max={100} value={soundVolume} onChange={(event) => setSoundVolume(Number(event.target.value))} className="h-1 w-full accent-sky-400" /></div>
        <label className={`flex items-center justify-between gap-4 ${silent ? "opacity-50" : ""}`}><span>🎵 {t("startMusicWithTimer")}</span><input type="checkbox" checked={autoPlay} disabled={silent} onChange={(event) => setAutoPlay(event.target.checked)} /></label>
        <div className={silent ? "pointer-events-none opacity-50" : ""}><label htmlFor="music-volume" className="mb-1 block text-sm text-neutral-300">{t("musicVolume")}</label><input id="music-volume" type="range" min={0} max={100} disabled={silent} value={musicVolume} onChange={(event) => setMusicVolume(Number(event.target.value))} className="h-1 w-full accent-sky-400" /></div>
      </div>
    </DialogContent>
  </Dialog>;
}
