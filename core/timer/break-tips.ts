import type { TranslationKey } from '@/i18n/types';

export const BREAK_TIP_KEYS = [
  'breakTipStand',
  'breakTipEyes',
  'breakTipStretch',
  'breakTipWater',
  'breakTipBreathe',
  'breakTipPosture',
  'breakTipScreenFree',
  'breakTipRest',
] as const satisfies readonly TranslationKey[];

export type BreakTipKey = (typeof BREAK_TIP_KEYS)[number];

export function getBreakTipKey(sessionNumber: number): BreakTipKey {
  const normalizedSession = Number.isFinite(sessionNumber) ? Math.max(1, Math.floor(sessionNumber)) : 1;
  return BREAK_TIP_KEYS[(normalizedSession - 1) % BREAK_TIP_KEYS.length];
}
