import { enMessages } from './en';
import { ptMessages } from './pt';
import { Language } from './types';

export const messages = { en: enMessages, pt: ptMessages } satisfies Record<Language, Record<keyof typeof enMessages, string>>;
