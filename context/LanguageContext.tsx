"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Timer states
    focus: 'Focus',
    break: 'Break',
    session: 'Session #',
    timeToFocus: 'Time to focus!',
    timeForBreak: 'Time for a break!',
    
    // Controls
    start: 'START',
    pause: 'PAUSE',
    resume: 'RESUME',
    stop: 'STOP',
    
    // Presets
    classic: 'Classic 25/5',
    quick: 'Quick 15min',
    
    // Playlist
    lofi: 'Lo-fi',
    classical: 'Classical',
    catholic: 'Gregorian Chants',
    
    // Footer
    disclaimer: 'Inspired by the Pomodoro® Technique (registered trademark of Francesco Cirillo). This site is not affiliated.',
    
    // Ad
    adPlaceholder: 'Advertisement Space'
  },
  pt: {
    // Timer states
    focus: 'Foco',
    break: 'Pausa',
    session: 'Sessão #',
    timeToFocus: 'Hora de focar!',
    timeForBreak: 'Hora da pausa!',
    
    // Controls
    start: 'INICIAR',
    pause: 'PAUSAR',
    resume: 'RETOMAR',
    stop: 'PARAR',
    
    // Presets
    classic: 'Clássico 25/5',
    quick: 'Rápido 15min',
    
    // Playlist
    lofi: 'Lo-fi',
    classical: 'Clássica',
    catholic: 'Cantos Gregorianos',
    
    // Footer
    disclaimer: 'Inspirado na Técnica Pomodoro® (marca registrada de Francesco Cirillo). Este site não é afiliado.',
    
    // Ad
    adPlaceholder: 'Espaço Publicitário'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}