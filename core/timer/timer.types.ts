export type TimerStatus = 'idle' | 'running' | 'paused';
export type TimerPhase = 'focus' | 'break';
export type TimerPreset = '25/5' | '15' | 'custom';

export type PresetSettings = {
  focus: number;
  break: number;
  longBreak: number;
};

export type TimerRuleState = {
  phase: TimerPhase;
  session: number;
  preset: TimerPreset;
  customPreset: PresetSettings;
};

export type TimerTransition = {
  phase: TimerPhase;
  session: number;
  durationMinutes: number;
};

export type TimerResetResult = TimerTransition & { status: 'idle' };
