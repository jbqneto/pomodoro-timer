"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { TimerProvider } from "@/context/TimerContext";
import { ConfigProvider } from "@/context/ConfigContext";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import TimerCard from "@/components/timer/TimerCard";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { SessionHistorySidebar } from "@/components/timer/SessionHistorySidebar";
import { useState } from "react";

function HomeContent() {
  const { t } = useLanguage();
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <div className={`flex min-h-dvh flex-col bg-neutral-950 text-neutral-100 transition-[padding] duration-300 ${historyOpen ? "md:pr-80" : "md:pr-[3.75rem]"}`}>
        <Header onOpenHistory={() => setHistoryOpen(true)} />
        <main className="flex-1">
          <section className="mx-auto mt-6 max-w-5xl space-y-6 px-4">
            <section className="px-1 py-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">{t('heroEyebrow')}</p>
              <h1 className="mt-2 text-sm leading-6 text-neutral-300">{t('heroTitle')}</h1>
            </section>

            <TimerCard />
          </section>
        </main>
        <Footer />
      </div>
      <SessionHistorySidebar open={historyOpen} onOpenChange={setHistoryOpen} />
    </>
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
