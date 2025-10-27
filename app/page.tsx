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

export default function Home() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ConfigProvider>
        <TimerProvider>
          <main className="min-h-dvh bg-neutral-950 text-neutral-100">
            <Header />
            <section className="mx-auto mt-6 max-w-3xl px-4 space-y-6">
              <TimerCard />
              <SettingsCard />
              <MusicMiniCard />
            </section>
            <Footer />
          </main>
        </TimerProvider>
        </ConfigProvider>
      </LanguageProvider>
      <Analytics />
    </ThemeProvider>
  );
}