import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import type { ProductAnalytics } from '@/application/ports/product-analytics';
import { ConfigProvider, useConfig } from '@/context/ConfigContext';
import { TimerProvider, useTimer } from '@/context/TimerContext';

beforeEach(() => localStorage.clear());

describe('six-event usage tracking', () => {
  it('counts the active mode on entry and after a real change; ignores settings toggles', () => {
    const analytics: ProductAnalytics = { track: vi.fn() };
    const wrapper = ({ children }: { children: ReactNode }) => <ConfigProvider analytics={analytics}>{children}</ConfigProvider>;
    const { result } = renderHook(() => useConfig(), { wrapper });
    expect(analytics.track).toHaveBeenCalledWith({ name: 'mode_used', properties: { interface_mode: 'simple' } });
    act(() => result.current.setSoundEnabled(false));
    act(() => result.current.setInterfaceMode('advanced'));
    act(() => result.current.setInterfaceMode('advanced'));
    expect(analytics.track).toHaveBeenCalledTimes(2);
    expect(analytics.track).toHaveBeenLastCalledWith({ name: 'mode_used', properties: { interface_mode: 'advanced' } });
  });

  it('tracks a preset only on actual focus start, never on pause/resume/stop', () => {
    const analytics: ProductAnalytics = { track: vi.fn() };
    const wrapper = ({ children }: { children: ReactNode }) =>
      <ConfigProvider analytics={analytics}><TimerProvider analytics={analytics}>{children}</TimerProvider></ConfigProvider>;
    const { result } = renderHook(() => useTimer(), { wrapper });
    act(() => result.current.setPreset('15'));
    expect(analytics.track).toHaveBeenCalledTimes(1); // Mode - Simple only
    act(() => result.current.startTimer());
    expect(analytics.track).toHaveBeenLastCalledWith({
      name: 'timer_preset_used', properties: { preset_category: 'quick', interface_mode: 'simple' },
    });
    act(() => result.current.pauseTimer());
    act(() => result.current.resumeTimer());
    act(() => result.current.stopTimer());
    expect(analytics.track).toHaveBeenCalledTimes(2);
  });

  it('tracks Task once for actual nonempty editing and End Day on confirmation without content', () => {
    const analytics: ProductAnalytics = { track: vi.fn() };
    const wrapper = ({ children }: { children: ReactNode }) =>
      <ConfigProvider analytics={analytics}><TimerProvider analytics={analytics}>{children}</TimerProvider></ConfigProvider>;
    const { result } = renderHook(() => useTimer(), { wrapper });
    act(() => result.current.setTask(''));
    act(() => result.current.setTask('Personal private task'));
    act(() => result.current.setTask('More text'));
    act(() => result.current.setTaskLocked(true));
    act(() => result.current.endDay('Private note'));
    expect(analytics.track).toHaveBeenCalledTimes(3); // Mode, Task, End Day.
    expect(analytics.track).toHaveBeenNthCalledWith(2, { name: 'task_used', properties: { interface_mode: 'simple' } });
    expect(analytics.track).toHaveBeenNthCalledWith(3, { name: 'end_day_used', properties: { interface_mode: 'simple' } });
  });
});
