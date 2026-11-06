import { ProductAnalytics, ProductEvent } from '@/application/ports/product-analytics';
import { MusicOptionId } from '@/core/music/music.types';

declare global {
  interface Window {
    umami?: {
      track(name: string, data: object): Promise<void> | void;
    };
  }
}

const PRODUCTION_HOST = 'focus.thedevlab.site';
const MAX_PENDING_EVENTS = 30;

// Human-readable labels come only from predefined, anonymous categories.
const PLAY_INTENT_LABELS: Record<MusicOptionId, string> = {
  silence: 'Silence',
  gregorian: 'Gregorian Chants',
  classical: 'Classical',
  lofi: 'Lo-fi',
  afterhours: 'Instrumental Jazz',
  custom: 'Custom Music',
};

export function getUmamiEventName(event: ProductEvent): string {
  switch (event.name) {
    case 'music_play_clicked': return `Play - ${PLAY_INTENT_LABELS[event.properties.music_category]}`;
    case 'mode_used': return `Mode - ${event.properties.interface_mode === 'simple' ? 'Simple' : 'Advanced'}`;
    case 'history_opened': return 'History Opened';
    case 'task_used': return 'Task Used';
    case 'timer_preset_used': {
      const labels = { classic: 'Classic', quick: 'Quick', custom: 'Custom' } as const;
      return `Timer - ${labels[event.properties.preset_category]}`;
    }
    case 'end_day_used': return 'End Day';
  }
}
const pendingEvents: ProductEvent[] = [];

function canTrack(): boolean {
  return typeof window !== 'undefined' && window.location.hostname === PRODUCTION_HOST;
}

function send(event: ProductEvent): void {
  try {
    const request = window.umami?.track(getUmamiEventName(event), event.properties);
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
