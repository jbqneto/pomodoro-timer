import { InterfaceMode } from '@/infrastructure/persistence/config.repository';
import { MusicOptionId } from '@/core/music/music.types';
import { TimerPhase } from '@/core/timer/timer.types';

export type FocusEventProperties = {
  preset_category: 'classic' | 'quick' | 'custom';
  duration_bucket: 'up_to_15' | '16_to_30' | '31_to_50' | 'over_50';
  music_category: MusicOptionId;
  interface_mode: InterfaceMode;
};
export type ReturnGapBucket = 'next_day' | '2_to_7_days' | '8_plus_days';
export type ProductFeature =
  | 'settings_opened' | 'history_opened' | 'history_cleared'
  | 'task_saved' | 'task_edited' | 'end_day' | 'daily_note_saved'
  | 'custom_music_added';
export type ProductSetting = 'auto_play' | 'alarm' | 'break_tips' | 'feedback_prompts';
export type MusicEventProperties = { music_category: MusicOptionId; interface_mode: InterfaceMode };
export type ProductEvent =
  | { name: 'app_opened'; properties: MusicEventProperties & { config_state: 'new' | 'saved' } }
  | { name: 'focus_started' | 'focus_completed' | 'focus_abandoned' | 'break_started' | 'break_completed' | 'break_abandoned'; properties: FocusEventProperties }
  | { name: 'timer_paused' | 'timer_resumed'; properties: { phase: TimerPhase; interface_mode: InterfaceMode } }
  | { name: 'preset_selected'; properties: { preset_category: FocusEventProperties['preset_category']; interface_mode: InterfaceMode } }
  | { name: 'interface_mode_changed'; properties: { from: InterfaceMode; to: InterfaceMode } }
  | { name: 'music_category_selected' | 'music_playback_started'; properties: MusicEventProperties }
  | { name: 'music_control_used'; properties: MusicEventProperties & { control: 'play' | 'pause' | 'next' | 'previous' } }
  | { name: 'setting_changed'; properties: { setting: ProductSetting; enabled: boolean; interface_mode: InterfaceMode } }
  | { name: 'feature_used'; properties: { feature: ProductFeature; interface_mode: InterfaceMode } }
  | { name: 'returning_focus_completed'; properties: { gap_bucket: ReturnGapBucket; interface_mode: InterfaceMode } }
  | { name: 'usefulness_feedback_submitted'; properties: { response: 'yes' | 'partly' | 'no'; interface_mode: InterfaceMode } };

export interface ProductAnalytics { track(event: ProductEvent): void; }
