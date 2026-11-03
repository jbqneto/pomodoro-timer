'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function HomeSeoContent() {
  const { t } = useLanguage();

  return (
    <section className="mt-12 border-t border-white/10 pb-16 pt-10 text-neutral-300" aria-labelledby="focus-beat-how-it-works">
      <h2 id="focus-beat-how-it-works" className="text-2xl font-semibold text-white">{t('seoHowTitle')}</h2>
      <p className="mt-3 max-w-3xl leading-7">{t('seoHowDescription')}</p>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-lg font-semibold text-white">{t('seoMusicTitle')}</h3>
          <p className="mt-2 leading-7">{t('seoMusicDescription')}</p>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-lg font-semibold text-white">{t('seoPrivacyTitle')}</h3>
          <p className="mt-2 leading-7">{t('seoPrivacyDescription')}</p>
        </section>
      </div>
    </section>
  );
}
