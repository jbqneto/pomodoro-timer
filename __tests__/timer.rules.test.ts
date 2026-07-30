import { describe, expect, it } from 'vitest';
import { parseDefaultPreset } from '@/core/timer/timer.presets';
import { abandonCycle, calculateRemainingSeconds, getNextTimerTransition, getPhaseDurationMinutes, restartCurrentPhase } from '@/core/timer/timer.rules';

const base = { phase: 'focus' as const, session: 1, preset: '25/5' as const, customPreset: { focus: 7, break: 3, longBreak: 9 } };
describe('timer domain rules', () => {
  it('calculates remaining seconds against an absolute deadline', () => {
    expect(calculateRemainingSeconds(10_000, 7_001)).toBe(3);
    expect(calculateRemainingSeconds(10_000, 100_000)).toBe(0);
    expect(calculateRemainingSeconds(0, 0)).toBe(0);
    expect(calculateRemainingSeconds(1_000, 1_000)).toBe(0);
  });
  it('moves focus to the short break without progressing the session', () => {
    expect(getNextTimerTransition(base)).toEqual({ phase: 'break', session: 1, durationMinutes: 5 });
  });
  it('selects the fourth session long break', () => {
    expect(getNextTimerTransition({ ...base, session: 4 })).toEqual({ phase: 'break', session: 4, durationMinutes: 15 });
  });
  it('moves a break to focus and progresses the session', () => {
    expect(getNextTimerTransition({ ...base, phase: 'break' })).toEqual({ phase: 'focus', session: 2, durationMinutes: 25 });
  });
  it('uses every custom phase duration', () => {
    const custom = { ...base, preset: 'custom' as const };
    expect(getPhaseDurationMinutes(custom)).toBe(7);
    expect(getPhaseDurationMinutes({ ...custom, phase: 'break' })).toBe(3);
    expect(getPhaseDurationMinutes({ ...custom, phase: 'break', session: 4 })).toBe(9);
  });
  it('restarts only the current phase and abandons the complete cycle', () => {
    const current = { ...base, phase: 'break' as const, session: 3 };
    expect(restartCurrentPhase(current)).toEqual({ status: 'idle', phase: 'break', session: 3, durationMinutes: 5 });
    expect(abandonCycle(current)).toEqual({ status: 'idle', phase: 'focus', session: 1, durationMinutes: 25 });
  });
  it('falls back when environment-shaped preset text is invalid', () => {
    expect(parseDefaultPreset('x,0,999')).toEqual({ focus: 25, break: 5, longBreak: 15 });
    expect(parseDefaultPreset('30,10,20')).toEqual({ focus: 30, break: 10, longBreak: 20 });
  });
});
