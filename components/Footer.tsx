"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mx-auto mt-10 max-w-3xl px-4 pb-10 text-center text-sm text-neutral-400">
      <p className="leading-relaxed">
        {t('disclaimer')}
      </p>
      <p className="mt-2 opacity-70">© 2025 {t('footerCopyright')} - By <a target="_blank" rel="noopener noreferrer" href="https://dev.jbqneto.com/">Queiroz Neto</a></p>
    </footer>
  );
}
