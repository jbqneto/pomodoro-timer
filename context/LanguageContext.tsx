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
    timerPreset: 'Timer preset',
    
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
    youtubeConsentTitle: 'YouTube player consent',
    youtubeConsentSubtitle: 'Required before loading the embedded player',
    youtubeConsentBody: 'This section uses an embedded YouTube player. If you continue, your browser may connect to YouTube to load media.',
    youtubeConsentAccept: 'Allow YouTube player',
    youtubeConsentDecline: 'Not now',
    youtubeConsentReview: 'Review YouTube consent',
    youtubeConsentInline: 'The YouTube player is blocked until you allow external media for this section.',
    
    // Footer
    disclaimer: 'Built for focused work with timed sessions and background music.',
    
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
    heroTitle: 'One timer. The right music. Real focus.',
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
    aboutTitle: 'Why Focus Beat exists',
    aboutIntro: 'This project combines structured work intervals with background music to create a calm and practical focus space.',
    focusCycleTitle: 'About the focus cycle',
    focusCycleDescription: 'Focus Beat uses simple focus and break cycles to help sustain attention, reduce mental fatigue, and make deep work easier to repeat.',
    musicTitle: 'Music for concentration',
    lofiDescription: 'Lo-fi uses subtle sonic imperfections and a steady atmosphere that can soften distracting background noise and make deep work easier.',
    classicalDescription: 'Instrumental classical music is often used for study because it avoids lyrical distraction and supports a more stable cognitive rhythm.',
    gregorianDescription: 'Gregorian chant offers a repetitive and contemplative texture that can help some users stay calm and focused during longer sessions.',
    footerCopyright: 'Focus Beat'
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
    timerPreset: 'Preset do timer',
    
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
    youtubeConsentTitle: 'Consentimento do player do YouTube',
    youtubeConsentSubtitle: 'Necessário antes de carregar o player embutido',
    youtubeConsentBody: 'Esta seção usa um player embutido do YouTube. Se você continuar, o seu navegador poderá se conectar ao YouTube para carregar a mídia.',
    youtubeConsentAccept: 'Permitir player do YouTube',
    youtubeConsentDecline: 'Agora não',
    youtubeConsentReview: 'Revisar consentimento do YouTube',
    youtubeConsentInline: 'O player do YouTube fica bloqueado até você permitir mídia externa para esta seção.',
    
    // Footer
    disclaimer: 'Feito para trabalho focado com sessões temporizadas e música de fundo.',
    
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
    heroTitle: 'Um timer, a música certa e foco de verdade.',
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
    aboutTitle: 'Por que o Focus Beat existe',
    aboutIntro: 'Este projeto combina ciclos estruturados de trabalho com música de fundo para criar um espaço de foco calmo e prático.',
    focusCycleTitle: 'Sobre o ciclo de foco',
    focusCycleDescription: 'O Focus Beat usa ciclos simples de foco e pausa para ajudar a sustentar a atenção, reduzir a fadiga mental e tornar o trabalho profundo mais consistente.',
    musicTitle: 'Música para concentração',
    lofiDescription: 'O lo-fi usa imperfeições sonoras sutis e uma atmosfera constante que pode suavizar ruídos externos e facilitar o trabalho profundo.',
    classicalDescription: 'A música clássica instrumental é muito usada para estudo porque evita distrações por letra e ajuda a manter um ritmo cognitivo mais estável.',
    gregorianDescription: 'O canto gregoriano oferece uma textura repetitiva e contemplativa que pode ajudar algumas pessoas a manter calma e foco em sessões mais longas.',
    footerCopyright: 'Focus Beat'
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
