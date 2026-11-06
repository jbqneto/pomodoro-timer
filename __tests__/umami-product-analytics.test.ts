import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  UmamiProductAnalytics,
  flushPendingUmamiEvents,
  getUmamiEventName,
} from '@/infrastructure/analytics/umami-product-analytics';
import type { ProductEvent } from '@/application/ports/product-analytics';

const modeEvent: ProductEvent = { name: 'mode_used', properties: { interface_mode: 'simple' } };

afterEach(() => {
  flushPendingUmamiEvents();
  vi.unstubAllGlobals();
});

describe('minimal Umami product events', () => {
  it('renders exactly the six requested event families', () => {
    const cases: [ProductEvent, string][] = [
      [{ name: 'music_play_clicked', properties: { music_category: 'afterhours', interface_mode: 'simple' } }, 'Play - Instrumental Jazz'],
      [{ name: 'music_play_clicked', properties: { music_category: 'classical', interface_mode: 'simple' } }, 'Play - Classical'],
      [{ name: 'music_play_clicked', properties: { music_category: 'gregorian', interface_mode: 'simple' } }, 'Play - Gregorian Chants'],
      [{ name: 'music_play_clicked', properties: { music_category: 'lofi', interface_mode: 'advanced' } }, 'Play - Lo-fi'],
      [{ name: 'music_play_clicked', properties: { music_category: 'custom', interface_mode: 'advanced' } }, 'Play - Custom Music'],
      [modeEvent, 'Mode - Simple'],
      [{ name: 'mode_used', properties: { interface_mode: 'advanced' } }, 'Mode - Advanced'],
      [{ name: 'history_opened', properties: { interface_mode: 'advanced' } }, 'History Opened'],
      [{ name: 'task_used', properties: { interface_mode: 'simple' } }, 'Task Used'],
      [{ name: 'timer_preset_used', properties: { preset_category: 'classic', interface_mode: 'simple' } }, 'Timer - Classic'],
      [{ name: 'timer_preset_used', properties: { preset_category: 'quick', interface_mode: 'simple' } }, 'Timer - Quick'],
      [{ name: 'timer_preset_used', properties: { preset_category: 'custom', interface_mode: 'advanced' } }, 'Timer - Custom'],
      [{ name: 'end_day_used', properties: { interface_mode: 'simple' } }, 'End Day'],
    ];
    for (const [event, label] of cases) expect(getUmamiEventName(event)).toBe(label);
  });

  it('sends a single event name and its anonymous props in production', () => {
    const track = vi.fn();
    vi.stubGlobal('window', { location: { hostname: 'focus.thedevlab.site' }, umami: { track } });
    new UmamiProductAnalytics().track(modeEvent);
    expect(track).toHaveBeenCalledExactlyOnceWith('Mode - Simple', { interface_mode: 'simple' });
  });

  it('never tracks on localhost or preview domains', () => {
    const track = vi.fn();
    vi.stubGlobal('window', { location: { hostname: 'my-preview.vercel.app' }, umami: { track } });
    new UmamiProductAnalytics().track(modeEvent);
    expect(track).not.toHaveBeenCalled();
  });

  it('queues and flushes an event before the script loads', () => {
    vi.stubGlobal('window', { location: { hostname: 'focus.thedevlab.site' } });
    const analytics = new UmamiProductAnalytics();
    analytics.track(modeEvent);
    const track = vi.fn();
    vi.stubGlobal('window', { location: { hostname: 'focus.thedevlab.site' }, umami: { track } });
    flushPendingUmamiEvents();
    flushPendingUmamiEvents();
    expect(track).toHaveBeenCalledExactlyOnceWith('Mode - Simple', { interface_mode: 'simple' });
  });

  it('does not break app behavior when tracking throws', () => {
    vi.stubGlobal('window', { location: { hostname: 'focus.thedevlab.site' }, umami: { track: () => { throw new Error('blocked'); } } });
    expect(() => new UmamiProductAnalytics().track(modeEvent)).not.toThrow();
  });
});
