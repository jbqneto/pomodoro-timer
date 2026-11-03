'use client';

import { messages } from '@/i18n/messages';
import type { Language } from '@/i18n/types';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface LanguageContextType {
  language: Language;
  setLanguage(value: Language): void;
  t(key: string): string;
}

const STORAGE_KEY = 'focus-timer-language';
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLanguage = 'en',
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  // The URL determines the indexable language. A stored preference must not
  // silently change the language of an indexed / or /pt page after hydration.
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => { setLanguage(initialLanguage); }, [initialLanguage]);

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const t = (key: string) => (messages[language] as Record<string, string>)[key] ?? key;
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
