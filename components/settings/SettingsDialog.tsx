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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InterfaceMode } from "@/infrastructure/persistence/config.repository";

type Props = { open: boolean; onClose: () => void };

export default function SettingsDialog({ open, onClose }: Props) {
  const { t } = useLanguage();
  const { soundEnabled, setSoundEnabled, soundVolume, setSoundVolume, musicVolume, setMusicVolume, autoPlay:autoPlayMusic, setAutoPlay:setAutoPlayMusic, showBreakTips, setShowBreakTips, interfaceMode = 'advanced', setInterfaceMode, askForOccasionalFeedback, setAskForOccasionalFeedback } = useConfig();

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="max-h-[85dvh] w-[calc(100vw-2rem)] max-w-2xl overflow-x-hidden overflow-y-auto rounded-2xl border-white/10 bg-neutral-900 p-6 text-neutral-100 shadow-xl">
        <DialogHeader>
          <DialogTitle>{t('settings')}</DialogTitle>
          <DialogDescription className="text-neutral-400">{t('settingsDescription')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-neutral-300">{t('interfaceMode')}</legend>
            <RadioGroup
              aria-label={t('interfaceMode')}
              value={interfaceMode}
              onValueChange={(value) => setInterfaceMode(value as InterfaceMode)}
              className="grid grid-cols-1 gap-2 sm:grid-cols-2"
            >
              {(['simple', 'advanced'] as const).map((mode) => {
                const title = mode === 'simple' ? t('simpleMode') : t('advancedMode');
                const description = mode === 'simple' ? t('simpleModeDescription') : t('advancedModeDescription');
                const descriptionId = `${mode}-mode-description`;
                return (
                  <label key={mode} className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${interfaceMode === mode ? 'border-sky-400 bg-sky-400/10 ring-1 ring-sky-400/40' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}>
                    <RadioGroupItem value={mode} aria-label={title} aria-describedby={descriptionId} className="mt-0.5 shrink-0" />
                    <span className="text-left">
                      <span className="block text-sm font-semibold text-white">{title}</span>
                      <span id={descriptionId} className="mt-1 block text-xs leading-5 text-neutral-400">{description}</span>
                    </span>
                  </label>
                );
              })}
            </RadioGroup>
          </fieldset>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">{t('timerPreset')}</label>
            <PresetSelector allowCustom={interfaceMode === 'advanced'} />
          </div>

          <label className="flex items-center justify-between gap-4">
            <span>{t('showBreakTips')}</span>
            <input type="checkbox" checked={showBreakTips} onChange={(e) => setShowBreakTips(e.target.checked)} />
          </label>
          <label className="flex items-center justify-between gap-4"><span>{t('askForOccasionalFeedback')}</span><input type="checkbox" checked={askForOccasionalFeedback} onChange={(e)=>setAskForOccasionalFeedback(e.target.checked)} /></label>

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
