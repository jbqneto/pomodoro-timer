import { InterfaceMode } from '@/infrastructure/persistence/config.repository';
import { MusicOptionId } from '@/core/music/music.types';

export type FocusEventProperties = { preset_category: 'classic' | 'quick' | 'custom'; duration_bucket: 'up_to_15' | '16_to_30' | '31_to_50' | 'over_50'; music_category: MusicOptionId; interface_mode: InterfaceMode };
export type ReturnGapBucket = 'next_day' | '2_to_7_days' | '8_plus_days';
export type ProductEvent =
  | { name: 'focus_started' | 'focus_completed' | 'focus_abandoned'; properties: FocusEventProperties }
  | { name: 'interface_mode_changed'; properties: { from: InterfaceMode; to: InterfaceMode } }
  | { name: 'returning_focus_completed'; properties: { gap_bucket: ReturnGapBucket; interface_mode: InterfaceMode } }
  | { name: 'usefulness_feedback_submitted'; properties: { response: 'yes' | 'partly' | 'no'; interface_mode: InterfaceMode } };
export interface ProductAnalytics { track(event: ProductEvent): void; }
