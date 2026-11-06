import { InterfaceMode } from '@/infrastructure/persistence/config.repository';
import { MusicOptionId } from '@/core/music/music.types';

export type PresetCategory = 'classic' | 'quick' | 'custom';

// Only six user-defined product signals, each with anonymous properties.
export type ProductEvent =
  | { name: 'music_play_clicked'; properties: { music_category: MusicOptionId; interface_mode: InterfaceMode } }
  | { name: 'mode_used'; properties: { interface_mode: InterfaceMode } }
  | { name: 'history_opened'; properties: { interface_mode: InterfaceMode } }
  | { name: 'task_used'; properties: { interface_mode: InterfaceMode } }
  | { name: 'timer_preset_used'; properties: { preset_category: PresetCategory; interface_mode: InterfaceMode } }
  | { name: 'end_day_used'; properties: { interface_mode: InterfaceMode } };

export interface ProductAnalytics { track(event: ProductEvent): void; }
