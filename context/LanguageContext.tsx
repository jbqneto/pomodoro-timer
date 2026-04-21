"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Language = 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'focus-timer-language';

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
    playerCollapse: 'Collapse player',
    playerExpand: 'Expand player',
    playerLabel: 'Background music',
    noPlaylist: 'No playlist selected',
    playVideo: 'Play video',
    pauseVideo: 'Pause video',
    
    // Footer
    disclaimer: 'Inspired by the Pomodoro® Technique (registered trademark of Francesco Cirillo). This site is not affiliated.',
    
    // Header
    home: 'Home',
    language: 'Language',
    about: 'About',
    contact: 'Contact',
    androidApp: 'Android App',
    settings: 'Settings',
    close: 'Close',

    // Ad
    adPlaceholder: 'Advertisement Space',

    // Landing copy
    heroEyebrow: 'Focus faster with music',
    heroTitle: 'Music and Pomodoro, finally working in your favor.',
    heroDescription: 'Start a focus session in seconds with classical, lo-fi, or Gregorian playlists.',
    androidBadge: 'Want something more complete?',
    androidTitle: 'The full focus experience is coming to Android.',
    androidDescription: 'Objectives, guided sessions, reminders, and personal insights will live in the mobile app. The web version stays fast and simple.',
    androidCta: 'Android app coming soon',

    // Settings
    alarm: 'Alarm',
    volume: 'Volume',
    startMusicWithTimer: 'Start music with timer',

    // About
    aboutTitle: 'Why this project exists',
    aboutIntro: 'This project combines structured work intervals with background music to create a calm and practical focus space.',
    pomodoroTitle: 'About the Pomodoro technique',
    pomodoroDescription: 'The Pomodoro technique was created by Francesco Cirillo in the 1980s. It alternates focused work blocks with short breaks to sustain attention and reduce mental fatigue.',
    musicTitle: 'Music for concentration',
    lofiDescription: 'Lo-fi uses subtle sonic imperfections and a steady atmosphere that can soften distracting background noise and make deep work easier.',
    classicalDescription: 'Instrumental classical music is often used for study because it avoids lyrical distraction and supports a more stable cognitive rhythm.',
    gregorianDescription: 'Gregorian chant offers a repetitive and contemplative texture that can help some users stay calm and focused during longer sessions.',
    footerCopyright: 'Pomodoro Timer App'
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
    playerCollapse: 'Recolher player',
    playerExpand: 'Expandir player',
    playerLabel: 'Música de fundo',
    noPlaylist: 'Nenhuma playlist selecionada',
    playVideo: 'Reproduzir vídeo',
    pauseVideo: 'Pausar vídeo',
    
    // Footer
    disclaimer: 'Inspirado na Técnica Pomodoro® (marca registrada de Francesco Cirillo). Este site não é afiliado.',
    
    // Header
    home: 'Início',
    language: 'Idioma',
    about: 'Sobre',
    contact: 'Contato',
    androidApp: 'App Android',
    settings: 'Configurações',
    close: 'Fechar',

    // Ad
    adPlaceholder: 'Espaço Publicitário',

    // Landing copy
    heroEyebrow: 'Foque mais rápido com música',
    heroTitle: 'Música e Pomodoro, finalmente jogando a seu favor.',
    heroDescription: 'Inicie uma sessão de foco em segundos com playlists clássicas, lo-fi ou gregorianas.',
    androidBadge: 'Quer algo mais completo?',
    androidTitle: 'A experiência completa de foco está chegando ao Android.',
    androidDescription: 'Objetivos, sessões guiadas, lembretes e insights pessoais ficarão no app mobile. A versão web continua rápida e simples.',
    androidCta: 'App Android em breve',

    // Settings
    alarm: 'Alarme',
    volume: 'Volume',
    startMusicWithTimer: 'Iniciar música com o timer',

    // About
    aboutTitle: 'Por que este projeto existe',
    aboutIntro: 'Este projeto combina ciclos estruturados de trabalho com música de fundo para criar um espaço de foco calmo e prático.',
    pomodoroTitle: 'Sobre a técnica Pomodoro',
    pomodoroDescription: 'A técnica Pomodoro foi criada por Francesco Cirillo nos anos 1980. Ela alterna blocos de trabalho focado com pausas curtas para sustentar a atenção e reduzir a fadiga mental.',
    musicTitle: 'Música para concentração',
    lofiDescription: 'O lo-fi usa imperfeições sonoras sutis e uma atmosfera constante que pode suavizar ruídos externos e facilitar o trabalho profundo.',
    classicalDescription: 'A música clássica instrumental é muito usada para estudo porque evita distrações por letra e ajuda a manter um ritmo cognitivo mais estável.',
    gregorianDescription: 'O canto gregoriano oferece uma textura repetitiva e contemplativa que pode ajudar algumas pessoas a manter calma e foco em sessões mais longas.',
    footerCopyright: 'Pomodoro Timer App'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
    if (storedLanguage === 'en' || storedLanguage === 'pt') {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

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
