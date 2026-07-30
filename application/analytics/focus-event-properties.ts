import { FocusEventProperties } from '@/application/ports/product-analytics';
import { MusicOptionId } from '@/core/music/music.types';
import { PresetSettings, TimerPreset } from '@/core/timer/timer.types';
import { InterfaceMode } from '@/infrastructure/persistence/config.repository';
import { getPresetSettings } from '@/core/timer/timer.presets';
export function toFocusEventProperties(preset:TimerPreset,custom:PresetSettings,music:MusicOptionId,mode:InterfaceMode):FocusEventProperties { const duration=getPresetSettings(preset,custom).focus; return {preset_category:preset==='25/5'?'classic':preset==='15'?'quick':'custom',duration_bucket:duration<=15?'up_to_15':duration<=30?'16_to_30':duration<=50?'31_to_50':'over_50',music_category:music,interface_mode:mode}; }
