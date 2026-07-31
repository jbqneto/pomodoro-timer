"use client";

import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import TimerCard from "@/components/timer/TimerCard";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { SessionHistorySidebar } from "@/components/timer/SessionHistorySidebar";
import { useEffect, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { AppProviders } from '@/composition/AppProviders';
import { createFreeAppServices } from '@/composition/create-free-app-services';

const services = createFreeAppServices();

function HomeContent() {
  const { t } = useLanguage();
  const [historyOpen, setHistoryOpen] = useState(false);
  const { interfaceMode } = useConfig();
  const showHistory = interfaceMode !== 'simple';

  useEffect(() => {
    if (!showHistory) setHistoryOpen(false);
  }, [showHistory]);

  return (
    <>
      <div className={`flex min-h-screen flex-col bg-neutral-950 text-neutral-100 transition-[padding] duration-300 ${showHistory ? (historyOpen ? "md:pr-80" : "md:pr-[3.75rem]") : ""}`}>
        <Header onOpenHistory={showHistory ? () => setHistoryOpen(true) : undefined} />
        <main className="flex-1">
          <section className="mx-auto mt-6 max-w-5xl space-y-6 px-4">
            <section className="px-1 py-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">{t('heroEyebrow')}</p>
              <h1 className="mt-2 text-sm leading-6 text-neutral-300">{t('heroTitle')}</h1>
            </section>

            <TimerCard analytics={services.analytics} />
          </section>
        </main>
        <Footer />
      </div>
      {showHistory && <SessionHistorySidebar open={historyOpen} onOpenChange={setHistoryOpen} />}
    </>
  );
}

export default function Home() {
  return (
    <AppProviders services={services}>
      <HomeContent />
      <Analytics />
    </AppProviders>
  );
}
