import type { enMessages } from './en';

export type Language = 'en' | 'pt';
export type TranslationKey = keyof typeof enMessages;
