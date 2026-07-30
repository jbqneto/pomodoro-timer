"use client";

import { useConfig } from "@/context/ConfigContext";
import { useLanguage } from "@/context/LanguageContext";
import { PresetSelector } from "../PresetSelector";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = { open: boolean; onClose: () => void };

export default function SettingsDialog({ open, onClose }: Props) {
  const { t } = useLanguage();
  const { soundEnabled, setSoundEnabled, soundVolume, setSoundVolume, musicVolume, setMusicVolume, autoPlay:autoPlayMusic, setAutoPlay:setAutoPlayMusic, showBreakTips, setShowBreakTips } = useConfig();

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="max-h-[85dvh] w-[calc(100vw-2rem)] max-w-2xl overflow-x-hidden overflow-y-auto rounded-2xl border-white/10 bg-neutral-900 p-6 text-neutral-100 shadow-xl">
        <DialogHeader>
          <DialogTitle>{t('settings')}</DialogTitle>
          <DialogDescription className="text-neutral-400">{t('settingsDescription')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">{t('timerPreset')}</label>
            <PresetSelector />
          </div>

          <label className="flex items-center justify-between gap-4">
            <span>{t('showBreakTips')}</span>
            <input type="checkbox" checked={showBreakTips} onChange={(e) => setShowBreakTips(e.target.checked)} />
          </label>

          <label className="flex items-center justify-between gap-4">
            <span>🔔 {t('alarm')}</span>
            <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
          </label>

          <div className={`${soundEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
            <label className="mb-1 block text-sm text-neutral-300">{t('alarmVolume')}</label>
            <input
              type="range"
              min={0}
              max={100}
              value={soundVolume}
              onChange={(e) => setSoundVolume(Number(e.target.value))}
              className="h-1 w-full appearance-none rounded bg-white/10 accent-sky-400"
            />
          </div>

          <label className="flex items-center justify-between gap-4">
            <span>🎵 {t('startMusicWithTimer')}</span>
            <input type="checkbox" checked={autoPlayMusic} onChange={(e) => setAutoPlayMusic(e.target.checked)} />
          </label>

          <div>
            <label className="mb-1 block text-sm text-neutral-300">{t('musicVolume')}</label>
            <input
              type="range"
              min={0}
              max={100}
              value={musicVolume}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              className="h-1 w-full appearance-none rounded bg-white/10 accent-sky-400"
            />
          </div>
        </div>

        <DialogClose asChild>
          <button className="mt-2 w-full rounded-xl bg-sky-500 px-4 py-2 font-semibold text-white hover:bg-sky-400">
            {t('close')}
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
