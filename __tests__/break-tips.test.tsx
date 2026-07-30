import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BREAK_TIP_KEYS, getBreakTipKey } from '@/core/timer/break-tips';
import { BreakTip } from '@/components/timer/BreakTip';
import { LanguageProvider } from '@/context/LanguageContext';

describe('break tips', () => {
  it('selects the first tip for session one and cycles after the final tip', () => {
    expect(getBreakTipKey(1)).toBe('breakTipStand');
    expect(getBreakTipKey(BREAK_TIP_KEYS.length + 1)).toBe('breakTipStand');
  });

  it('selects tips deterministically', () => {
    expect(getBreakTipKey(6)).toBe(getBreakTipKey(6));
    expect(getBreakTipKey(6)).toBe('breakTipPosture');
  });

  it('renders one accessible, non-live note and keeps it through rerenders', () => {
    const { rerender } = render(<LanguageProvider><BreakTip sessionNumber={3} /></LanguageProvider>);
    const note = screen.getByRole('note', { name: 'Break tip' });
    expect(note).toHaveTextContent('Gently relax your shoulders, neck, wrists, and hands.');
    expect(note).not.toHaveAttribute('aria-live');
    expect(screen.getAllByRole('note')).toHaveLength(1);

    rerender(<LanguageProvider><BreakTip sessionNumber={3} /></LanguageProvider>);
    expect(screen.getByRole('note')).toHaveTextContent('Gently relax your shoulders, neck, wrists, and hands.');
  });
});
