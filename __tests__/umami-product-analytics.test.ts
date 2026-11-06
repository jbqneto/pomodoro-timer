import { afterEach, describe, expect, it, vi } from 'vitest';
import { UmamiProductAnalytics, flushPendingUmamiEvents } from '@/infrastructure/analytics/umami-product-analytics';
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
