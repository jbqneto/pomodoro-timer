"use client";

import { useTimer } from "@/context/TimerContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export function PresetSelector() {
  const { preset, setPreset, state } = useTimer();
  const { t } = useLanguage();

  const handlePresetChange = (newPreset: '25/5' | '15') => {
    if (state === 'idle') {
      setPreset(newPreset);
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={() => handlePresetChange('25/5')}
        variant={preset === '25/5' ? 'default' : 'secondary'}
        size="sm"
        className={`rounded-lg px-6 py-2 text-sm font-medium transition-all focus-ring ${
          preset === '25/5'
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        } ${state !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={state !== 'idle'}
      >
        {t('classic')}
      </Button>
      
      <Button
        onClick={() => handlePresetChange('15')}
        variant={preset === '15' ? 'default' : 'secondary'}
        size="sm"
        className={`rounded-lg px-6 py-2 text-sm font-medium transition-all focus-ring ${
          preset === '15'
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        } ${state !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={state !== 'idle'}
      >
        {t('quick')}
      </Button>
    </div>
  );
}