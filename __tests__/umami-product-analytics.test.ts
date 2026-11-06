import { afterEach, describe, expect, it, vi } from 'vitest';
import { UmamiProductAnalytics, flushPendingUmamiEvents, getUmamiEventName } from '@/infrastructure/analytics/umami-product-analytics';
import type { ProductEvent } from '@/application/ports/product-analytics';

const opened: ProductEvent = {
  name: 'app_opened',
  properties: { interface_mode: 'simple', music_category: 'gregorian', config_state: 'new' },
};

afterEach(() => {
  flushPendingUmamiEvents();
  vi.unstubAllGlobals();
});

describe('UmamiProductAnalytics', () => {
  it('sends typed events and properties only on production hostname', () => {
    const track = vi.fn();
    vi.stubGlobal('window', { location: { hostname: 'focus.thedevlab.site' }, umami: { track } });
    new UmamiProductAnalytics().track(opened);
    expect(track).toHaveBeenCalledWith('app_opened', opened.properties);
  });

  it('labels Play clicks with the selected music category, without modifying their properties', () => {
    const cases = [
      ['afterhours', 'Play - Instrumental Jazz'],
      ['classical', 'Play - Classical'],
      ['gregorian', 'Play - Gregorian Chants'],
      ['lofi', 'Play - Lo-fi'],
      ['custom', 'Play - Custom Music'],
    ] as const;
    const track = vi.fn();
    vi.stubGlobal('window', { location: { hostname: 'focus.thedevlab.site' }, umami: { track } });

    for (const [music_category, label] of cases) {
      const event: ProductEvent = {
        name: 'music_control_used',
        properties: { control: 'play', music_category, interface_mode: 'simple' },
      };
      new UmamiProductAnalytics().track(event);
      expect(track).toHaveBeenLastCalledWith(label, event.properties);
      expect(getUmamiEventName(event)).toBe(label);
    }
    expect(track).toHaveBeenCalledTimes(cases.length);
  });

  it('keeps other controls and confirmed playback as separate unchanged events', () => {
    const pause: ProductEvent = { name: 'music_control_used', properties: { control: 'pause', music_category: 'afterhours', interface_mode: 'advanced' } };
    const played: ProductEvent = { name: 'music_playback_started', properties: { music_category: 'afterhours', interface_mode: 'advanced' } };
    expect(getUmamiEventName(pause)).toBe('music_control_used');
    expect(getUmamiEventName(played)).toBe('music_playback_started');
  });

  it('ignores preview and localhost domains', () => {
    const track = vi.fn();
    vi.stubGlobal('window', { location: { hostname: 'my-preview.vercel.app' }, umami: { track } });
    new UmamiProductAnalytics().track(opened);
    expect(track).not.toHaveBeenCalled();
  });

  it('queues events before the script loads and flushes them once', () => {
    vi.stubGlobal('window', { location: { hostname: 'focus.thedevlab.site' } });
    const analytics = new UmamiProductAnalytics();
    analytics.track(opened);
    const track = vi.fn();
    vi.stubGlobal('window', { location: { hostname: 'focus.thedevlab.site' }, umami: { track } });
    flushPendingUmamiEvents();
    flushPendingUmamiEvents();
    expect(track).toHaveBeenCalledTimes(1);
  });

  it('keeps application operations safe when the tracker throws', () => {
    vi.stubGlobal('window', { location: { hostname: 'focus.thedevlab.site' }, umami: { track: () => { throw new Error('blocked'); } } });
    expect(() => new UmamiProductAnalytics().track(opened)).not.toThrow();
  });
});
