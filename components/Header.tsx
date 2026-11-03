"use client"

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import SettingsDialog from "./settings/SettingsDialog";
import Link from "next/link";
import { History } from "lucide-react";
import { useConfig } from "@/context/ConfigContext";

type HeaderProps = {
  onOpenHistory?: () => void;
  page?: 'home' | 'about';
};

export default function Header({ onOpenHistory, page = 'home' }: HeaderProps) {
  const { t,language } = useLanguage();
  const { interfaceMode, isFirstVisit } = useConfig();
  const showHistory = interfaceMode !== 'simple';
  const homeHref = language === 'pt' ? '/pt' : '/';
  const aboutHref = language === 'pt' ? '/pt/about' : '/about';
  const englishHref = page === 'about' ? '/about' : '/';
  const portugueseHref = page === 'about' ? '/pt/about' : '/pt';
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const settingsOpener = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isFirstVisit) setOpen(true);
  }, [isFirstVisit]);

  const openSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
    settingsOpener.current = event.currentTarget;
    setOpen(true);
  };

  const closeSettings = () => {
    setOpen(false);
    queueMicrotask(() => settingsOpener.current?.focus());
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/75 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Focus Beat</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          <Link className="text-sm text-neutral-300 hover:text-white" href={homeHref}>{t('home')}</Link>
          <Link className="text-sm text-neutral-300 hover:text-white" href={aboutHref}>{ t('about') }</Link>

          {/* Lang switch */}
          <div className="ml-2 inline-flex overflow-hidden rounded-full border border-white/10">
            <Link href={englishHref} hrefLang="en" aria-label="Switch to English" className={language === 'en' ? 'bg-sky-500 px-3 py-1 text-sm text-white' : 'px-3 py-1 text-sm text-neutral-200 hover:bg-white/5'}>EN</Link>
            <Link href={portugueseHref} hrefLang="pt-BR" aria-label="Mudar para Português" className={language === 'pt' ? 'bg-sky-500 px-3 py-1 text-sm text-white' : 'px-3 py-1 text-sm text-neutral-200 hover:bg-white/5'}>PT</Link>
          </div>

          {/* Settings gear */}
          <button
            className="rounded-full p-2 text-neutral-400 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/30"
            aria-label={t('settings')}
            onClick={openSettings}
          >
            ⚙
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="rounded-md p-2 text-neutral-300 hover:bg-white/5 md:hidden"
          onClick={() => setMenuOpen((s) => !s)}
          aria-label="Abrir menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-50 border-b border-white/10 bg-neutral-950/95 shadow-2xl backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3">
            <Link className="text-sm text-neutral-200" href={homeHref} onClick={()=>setMenuOpen(false)}>{t('home')}</Link>
            <Link className="text-sm text-neutral-200" href={aboutHref} onClick={()=>setMenuOpen(false)}>{t('about')}</Link>

            {showHistory && onOpenHistory && (
              <button
                type="button"
                className="flex items-center gap-2 py-1 text-left text-sm text-neutral-200"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenHistory();
                }}
              >
                <History className="h-4 w-4 text-sky-300" />
                {t('sessionHistory')}
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">{t('language')}</span>
              <div className="inline-flex overflow-hidden rounded-full border border-white/10">
                <Link href={englishHref} hrefLang="en" onClick={() => setMenuOpen(false)} className={language === 'en' ? 'bg-sky-500 px-3 py-1 text-sm text-white' : 'px-3 py-1 text-sm text-neutral-200'}>EN</Link>
                <Link href={portugueseHref} hrefLang="pt-BR" onClick={() => setMenuOpen(false)} className={language === 'pt' ? 'bg-sky-500 px-3 py-1 text-sm text-white' : 'px-3 py-1 text-sm text-neutral-200'}>PT</Link>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button className="rounded-full p-2 text-neutral-400 hover:bg-white/5" aria-label={t('settings')} onClick={openSettings}>⚙</button>
            </div>
          </div>
        </div>
      )}

      <SettingsDialog open={open} onClose={closeSettings} />
    </header>
  );
}
