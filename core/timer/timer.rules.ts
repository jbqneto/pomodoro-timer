import { getPresetSettings } from './timer.presets';
import { TimerResetResult, TimerRuleState, TimerTransition } from './timer.types';

export function calculateRemainingSeconds(endAt: number, now: number): number {
  if (!Number.isFinite(endAt) || !Number.isFinite(now) || endAt <= 0) return 0;
  return Math.max(0, Math.ceil((endAt - now) / 1000));
}

export function isLongBreakSession(session: number): boolean {
  return session % 4 === 0;
}

export function getPhaseDurationMinutes(input: TimerRuleState): number {
  const settings = getPresetSettings(input.preset, input.customPreset);
  if (input.phase === 'focus') return settings.focus;
  return isLongBreakSession(input.session) ? settings.longBreak : settings.break;
}

export function getNextTimerTransition(input: TimerRuleState): TimerTransition {
  const nextPhase = input.phase === 'focus' ? 'break' : 'focus';
  const nextSession = input.phase === 'break' ? input.session + 1 : input.session;
  const nextState: TimerRuleState = { ...input, phase: nextPhase, session: nextSession };
  return { phase: nextPhase, session: nextSession, durationMinutes: getPhaseDurationMinutes(nextState) };
}

export function restartCurrentPhase(input: TimerRuleState): TimerResetResult {
  return { status: 'idle', phase: input.phase, session: input.session, durationMinutes: getPhaseDurationMinutes(input) };
}

export function abandonCycle(input: Pick<TimerRuleState, 'preset' | 'customPreset'>): TimerResetResult {
  const state: TimerRuleState = { ...input, phase: 'focus', session: 1 };
  return { status: 'idle', phase: 'focus', session: 1, durationMinutes: getPhaseDurationMinutes(state) };
}
