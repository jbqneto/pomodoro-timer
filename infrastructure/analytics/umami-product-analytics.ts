import { ProductAnalytics, ProductEvent } from '@/application/ports/product-analytics';

declare global {
  interface Window {
    umami?: {
      track(name: string, data: object): Promise<void> | void;
    };
  }
}

const PRODUCTION_HOST = 'focus.thedevlab.site';
const MAX_PENDING_EVENTS = 30;
const pendingEvents: ProductEvent[] = [];

function canTrack(): boolean {
  return typeof window !== 'undefined' && window.location.hostname === PRODUCTION_HOST;
}

function send(event: ProductEvent): void {
  try {
    const request = window.umami?.track(event.name, event.properties);
    if (request && typeof request.catch === 'function') {
      void request.catch(() => { /* Analytics must never affect the app. */ });
    }
  } catch {
    /* Analytics must never affect the app. */
  }
}

export function flushPendingUmamiEvents(): void {
  if (!canTrack() || typeof window.umami?.track !== 'function') return;
  for (const event of pendingEvents.splice(0)) send(event);
}

export class UmamiProductAnalytics implements ProductAnalytics {
  track(event: ProductEvent): void {
    if (!canTrack()) return;
    if (typeof window.umami?.track !== 'function') {
      if (pendingEvents.length >= MAX_PENDING_EVENTS) pendingEvents.shift();
      pendingEvents.push(event);
      return;
    }
    flushPendingUmamiEvents();
    send(event);
  }
}
