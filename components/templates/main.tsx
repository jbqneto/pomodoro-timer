"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "../ThemeProvider";
import { ConfigProvider } from "@/context/ConfigContext";
import { Analytics } from "@vercel/analytics/next";
import Header from "../Header";
import Footer from "../Footer";
import { ReactNode } from "react";


export default function MainTemplate({ children }: { children: ReactNode }) {
  return (
        <ThemeProvider>
      <LanguageProvider>
        <ConfigProvider>
          <div className="flex min-h-dvh flex-col bg-neutral-950 text-neutral-100">
            <Header />
            <main className="flex-1">
              <section className="mx-auto mt-6 max-w-3xl space-y-6 px-4">
                {children}
              </section>
            </main>
            <Footer />
          </div>
        </ConfigProvider>
      </LanguageProvider>
      <Analytics />
    </ThemeProvider>
  )
}
