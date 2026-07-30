import { PresetSettings, TimerPreset } from './timer.types';

export const FALLBACK_DEFAULT_PRESET: PresetSettings = { focus: 25, break: 5, longBreak: 15 };
export const QUICK_PRESET: PresetSettings = { focus: 15, break: 2, longBreak: 5 };
export const DEFAULT_CUSTOM_PRESET: PresetSettings = { focus: 25, break: 5, longBreak: 15 };

export function isValidPresetSettings(value: unknown): value is PresetSettings {
  if (!value || typeof value !== 'object') return false;
  const valueAsPreset = value as PresetSettings;
  return [valueAsPreset.focus, valueAsPreset.break, valueAsPreset.longBreak].every(
    (duration) => Number.isInteger(duration) && duration >= 1 && duration <= 180,
  );
}

export function parseDefaultPreset(value: string | undefined): PresetSettings {
  if (!value) return FALLBACK_DEFAULT_PRESET;
  const [focus, shortBreak, longBreak, ...extra] = value.split(',').map(Number);
  const candidate = { focus, break: shortBreak, longBreak };
  return extra.length === 0 && isValidPresetSettings(candidate) ? candidate : FALLBACK_DEFAULT_PRESET;
}

export const DEFAULT_PRESET = parseDefaultPreset(process.env.NEXT_PUBLIC_PRESET_25);

export function getPresetSettings(preset: TimerPreset, customPreset: PresetSettings): PresetSettings {
  if (preset === 'custom') return customPreset;
  return preset === '15' ? QUICK_PRESET : DEFAULT_PRESET;
}
