"use client";

import { useTimer } from "@/context/TimerContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { ChangeEvent } from "react";

export function PresetSelector() {
  const { preset, customPreset, setPreset, setCustomPreset, state } = useTimer();
  const { t } = useLanguage();
  const isIdle = state === 'idle';

  const handlePresetChange = (newPreset: '25/5' | '15' | 'custom') => {
    if (isIdle) {
      setPreset(newPreset);
    }
  };

  function handleDurationChange(key: keyof typeof customPreset, event: ChangeEvent<HTMLInputElement>) {
    const duration = Number(event.target.value);
    if (!Number.isInteger(duration) || duration < 1 || duration > 180) return;

    setCustomPreset({ ...customPreset, [key]: duration });
  }

  const presetButtonClass = (presetId: '25/5' | '15' | 'custom') =>
    `h-10 w-full justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all focus-ring ${
      preset === presetId
        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
    } ${!isIdle ? 'cursor-not-allowed opacity-50' : ''}`;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Button
          onClick={() => handlePresetChange('25/5')}
          variant={preset === '25/5' ? 'default' : 'secondary'}
          size="sm"
          className={presetButtonClass('25/5')}
          disabled={!isIdle}
        >
          {t('classic')}
        </Button>

        <Button
          onClick={() => handlePresetChange('15')}
          variant={preset === '15' ? 'default' : 'secondary'}
          size="sm"
          className={presetButtonClass('15')}
          disabled={!isIdle}
        >
          {t('quick')}
        </Button>

        <Button
          onClick={() => handlePresetChange('custom')}
          variant={preset === 'custom' ? 'default' : 'secondary'}
          size="sm"
          className={presetButtonClass('custom')}
          disabled={!isIdle}
        >
          {t('custom')}
        </Button>
      </div>

      {preset === 'custom' && (
        <fieldset disabled={!isIdle} className="grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-3">
          <label className="min-w-0 text-xs font-medium text-neutral-300">
            {t('focusDuration')}
            <input
              type="number"
              min={1}
              max={180}
              value={customPreset.focus}
              onChange={(event) => handleDurationChange('focus', event)}
              className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-neutral-950 px-2 text-sm text-white outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-400/30 disabled:cursor-not-allowed"
            />
          </label>

          <label className="min-w-0 text-xs font-medium text-neutral-300">
            {t('shortBreak')}
            <input
              type="number"
              min={1}
              max={180}
              value={customPreset.break}
              onChange={(event) => handleDurationChange('break', event)}
              className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-neutral-950 px-2 text-sm text-white outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-400/30 disabled:cursor-not-allowed"
            />
          </label>

          <label className="min-w-0 text-xs font-medium text-neutral-300">
            {t('longBreak')}
            <input
              type="number"
              min={1}
              max={180}
              value={customPreset.longBreak}
              onChange={(event) => handleDurationChange('longBreak', event)}
              className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-neutral-950 px-2 text-sm text-white outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-400/30 disabled:cursor-not-allowed"
            />
          </label>
        </fieldset>
      )}
    </div>
  );
}
