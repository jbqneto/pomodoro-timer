import { describe, expect, it } from 'vitest';
import { enMessages } from '@/i18n/en';
import { ptMessages } from '@/i18n/pt';

describe('translation dictionaries', () => {
  it('have exact key parity', () => expect(Object.keys(ptMessages).sort()).toEqual(Object.keys(enMessages).sort()));
  it('contain representative About, playlist, and accessibility copy', () => {
    expect(enMessages.aboutTitle).toBe('Why Focus Beat exists');
    expect(ptMessages.gregorian).toBe('Cantos Gregorianos');
    expect(enMessages.expandHistory).toBe('Expand session history');
    expect(ptMessages.youtubeConsentTitle).toBe('Consentimento do player do YouTube');
  });
});
