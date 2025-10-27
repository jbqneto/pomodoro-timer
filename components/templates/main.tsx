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
          <main className="min-h-dvh bg-neutral-950 text-neutral-100">
            <Header />
            <section className="mx-auto mt-6 max-w-3xl px-4 space-y-6">
              {children}
            </section>
            <Footer />
          </main>
        </ConfigProvider>
      </LanguageProvider>
      <Analytics />
    </ThemeProvider>
  )
}