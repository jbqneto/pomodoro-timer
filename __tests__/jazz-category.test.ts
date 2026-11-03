import { describe, expect, it } from 'vitest';
import { getMusicOption, getMusicSource, isMusicOptionId } from '@/core/music/music.catalog';
import { enMessages } from '@/i18n/en';
import { ptMessages } from '@/i18n/pt';

describe('instrumental jazz presentation', () => {
  it('keeps the stable afterhours ID and existing playlist for stored preferences', () => {
    expect(isMusicOptionId('afterhours')).toBe(true);
    expect(getMusicOption('afterhours').id).toBe('afterhours');
    expect(getMusicSource('afterhours')).toEqual({ type: 'youtube-playlist', playlistId: 'PLGMEr1MK-Khc' });
  });

  it('uses category names and descriptions in both languages', () => {
    expect(enMessages.afterhours).toBe('Instrumental Jazz');
    expect(ptMessages.afterhours).toBe('Jazz Instrumental');
    expect(enMessages.afterhoursSubtitle).toBeTruthy();
    expect(ptMessages.afterhoursSubtitle).toBeTruthy();
    expect(enMessages.jazzDescription).toBeTruthy();
    expect(ptMessages.jazzDescription).toBeTruthy();
  });
});
