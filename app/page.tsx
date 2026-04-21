"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { TimerProvider } from "@/context/TimerContext";
import { ConfigProvider } from "@/context/ConfigContext";
import { Analytics } from "@vercel/analytics/next"
import Header from "@/components/Header";
import TimerCard from "@/components/timer/TimerCard";
import SettingsCard from "@/components/settings/SettingsCard";
import MusicMiniCard from "@/components/music/MusicMiniCard";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

function HomeContent() {
  const { t } = useLanguage();

  return (
    <main className="min-h-dvh bg-neutral-950 text-neutral-100">
      <Header />
      <section className="mx-auto mt-6 max-w-3xl px-4 space-y-6">
        <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">{t('heroEyebrow')}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">{t('heroTitle')}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-300 md:text-base">{t('heroDescription')}</p>
        </section>

        <TimerCard />
        <SettingsCard />
        <MusicMiniCard />

        <section id="android-app" className="rounded-3xl border border-sky-500/20 bg-sky-500/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">{t('androidBadge')}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{t('androidTitle')}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-200 md:text-base">{t('androidDescription')}</p>
          <Button className="mt-5 rounded-full bg-sky-500 px-6 text-white hover:bg-sky-400">
            {t('androidCta')}
          </Button>
        </section>
      </section>
      <Footer />
    </main>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ConfigProvider>
          <TimerProvider>
            <HomeContent />
          </TimerProvider>
        </ConfigProvider>
      </LanguageProvider>
      <Analytics />
    </ThemeProvider>
  );
}
