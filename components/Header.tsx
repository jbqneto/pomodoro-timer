"use client"

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import SettingsDialog from "./settings/SettingsDialog";

export default function Header() {
  const { t,language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/75 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Pomodoro Timer</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          <a className="text-sm text-neutral-300 hover:text-white" href="#!">Home</a>
          <a className="text-sm text-neutral-300 hover:text-white" href="#">{ t('about') }</a>
          <a className="text-sm text-neutral-300 hover:text-white" href="#!">{ t('contact') }</a>

          {/* Lang switch */}
          <div className="ml-2 inline-flex overflow-hidden rounded-full border border-white/10">
            <button
              className={`px-3 py-1 text-sm ${language === "en" ? "bg-sky-500 text-white" : "text-neutral-200 hover:bg-white/5"}`}
              onClick={() => setLanguage("en")}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              className={`px-3 py-1 text-sm ${language === "pt" ? "bg-sky-500 text-white" : "text-neutral-200 hover:bg-white/5"}`}
              onClick={() => setLanguage("pt")}
              aria-label="Mudar para Português"
            >
              PT
            </button>
          </div>

          <ThemeToggle />

          {/* Settings gear */}
          <button
            className="rounded-full p-2 text-neutral-400 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/30"
            aria-label="Abrir configurações"
            onClick={() => setOpen(true)}
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
        <div className="border-t border-white/10 md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3">
            <a className="text-sm text-neutral-200" href="#!" onClick={()=>setMenuOpen(false)}>Home</a>
            <a className="text-sm text-neutral-200" href="#!" onClick={()=>setMenuOpen(false)}>Sobre</a>
            <a className="text-sm text-neutral-200" href="#!" onClick={()=>setMenuOpen(false)}>Contato</a>

            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">Idioma</span>
              <div className="inline-flex overflow-hidden rounded-full border border-white/10">
                <button className={`px-3 py-1 text-sm ${language==="en"?"bg-sky-500 text-white":"text-neutral-200"}`} onClick={()=>setLanguage("en")}>EN</button>
                <button className={`px-3 py-1 text-sm ${language==="pt"?"bg-sky-500 text-white":"text-neutral-200"}`} onClick={()=>setLanguage("pt")}>PT</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <ThemeToggle />
              <button className="rounded-full p-2 text-neutral-400 hover:bg-white/5" onClick={()=>setOpen(true)}>⚙</button>
            </div>
          </div>
        </div>
      )}

      <SettingsDialog open={open} onClose={()=>setOpen(false)} />
    </header>
  );
}
