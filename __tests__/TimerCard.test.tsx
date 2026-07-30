import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TimerCard from '@/components/timer/TimerCard';

const mocks = vi.hoisted(() => ({ phase: 'focus', session: 1, showBreakTips: true }));

vi.mock('@/context/TimerContext', () => ({ useTimer: () => ({ phase: mocks.phase, session: mocks.session }) }));
vi.mock('@/context/ConfigContext', () => ({ useConfig: () => ({ showBreakTips: mocks.showBreakTips }) }));
vi.mock('@/context/LanguageContext', () => ({ useLanguage: () => ({ t: (key: string) => ({
  breakTipTitle: 'Break tip', breakTipStand: 'Stand up and walk for a moment.',
}[key] ?? key) }) }));
vi.mock('@/components/Timer', () => ({ Timer: () => <div>timer</div> }));
vi.mock('@/components/timer/Controls', () => ({ Controls: () => <div>controls</div> }));
vi.mock('@/components/music/MusicMiniCard', () => ({ default: () => <div>music</div> }));
vi.mock('@/components/timer/TaskInput', () => ({ TaskInput: () => <div data-testid="task-input">task</div> }));

describe('TimerCard break-tip integration', () => {
  beforeEach(() => { mocks.phase = 'focus'; mocks.session = 1; mocks.showBreakTips = true; });

  it('renders TaskInput during focus', () => {
    render(<TimerCard />);
    expect(screen.getByTestId('task-input')).toBeInTheDocument();
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });

  it('replaces TaskInput with exactly one tip during an enabled break', () => {
    mocks.phase = 'break';
    render(<TimerCard />);
    expect(screen.queryByTestId('task-input')).not.toBeInTheDocument();
    expect(screen.getAllByRole('note')).toHaveLength(1);
    expect(screen.getByText('controls')).toBeInTheDocument();
  });

  it('preserves TaskInput during breaks when tips are disabled', () => {
    mocks.phase = 'break'; mocks.showBreakTips = false;
    render(<TimerCard />);
    expect(screen.getByTestId('task-input')).toBeInTheDocument();
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });
});
