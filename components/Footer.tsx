"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-8 border-t border-white/10 px-4 py-4 text-center text-sm text-neutral-400">
      <div className="mx-auto max-w-3xl space-y-1.5">
        <p className="leading-relaxed">{t('disclaimer')}</p>
        <p className="text-xs text-neutral-500">{t('androidFooterNotice')}</p>
        <p className="text-xs text-neutral-500">© {new Date().getFullYear()} {t('footerCopyright')} · By <a className="hover:text-neutral-300" target="_blank" rel="noopener noreferrer" href="https://dev.jbqneto.com/">Queiroz Neto</a></p>
      </div>
    </footer>
  );
}
