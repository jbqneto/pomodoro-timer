import type { Metadata } from 'next';
import type { Language } from '@/i18n/types';

export const SITE_URL = 'https://focus.thedevlab.site';
export type PageKind = 'home' | 'about';

const paths: Record<Language, Record<PageKind, string>> = {
  en: { home: '/', about: '/about' },
  pt: { home: '/pt', about: '/pt/about' },
};

const copy: Record<Language, Record<PageKind, { title: string; description: string }>> = {
  en: {
    home: {
      title: 'Free Pomodoro Timer with Music',
      description: 'Free online Pomodoro timer for work and study. Focus with 25/5 sessions, custom breaks and optional lo-fi, classical or Gregorian music.',
    },
    about: {
      title: 'About Focus Beat',
      description: 'Learn how Focus Beat combines Pomodoro focus sessions, optional background music and local-only activity history.',
    },
  },
  pt: {
    home: {
      title: 'Timer Pomodoro Online Grátis com Música',
      description: 'Timer Pomodoro grátis para estudar e trabalhar. Faça ciclos 25/5, configure pausas e escolha música lo-fi, clássica ou gregoriana.',
    },
    about: {
      title: 'Sobre o Focus Beat',
      description: 'Conheça o Focus Beat: sessões Pomodoro, música de fundo opcional e histórico de atividades salvo apenas no navegador.',
    },
  },
};

export const urlFor = (language: Language, page: PageKind) => SITE_URL + paths[language][page];

export function rootMetadata(language: Language): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: 'Focus Beat',
    title: {
      default: copy[language].home.title + ' | Focus Beat',
      template: '%s | Focus Beat',
    },
    description: copy[language].home.description,
    authors: [{ name: 'José Neto', url: 'https://dev.jbqneto.com' }],
    robots: { index: true, follow: true },
    icons: { icon: '/imgs/favico.ico' },
  };
}

export function pageMetadata(language: Language, page: PageKind): Metadata {
  const meta = copy[language][page];
  const canonical = urlFor(language, page);
  const ogImage = SITE_URL + '/imgs/logo.png';
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        en: urlFor('en', page),
        'pt-BR': urlFor('pt', page),
        'x-default': urlFor('en', page),
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Focus Beat',
      title: meta.title,
      description: meta.description,
      locale: language === 'pt' ? 'pt_BR' : 'en_US',
      url: canonical,
      images: [{ url: ogImage, alt: 'Focus Beat' }],
    },
    twitter: {
      card: 'summary',
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
  };
}

export function webApplicationJsonLd(language: Language): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Focus Beat',
    url: urlFor(language, 'home'),
    description: copy[language].home.description,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Any',
    inLanguage: language === 'pt' ? 'pt-BR' : 'en',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
