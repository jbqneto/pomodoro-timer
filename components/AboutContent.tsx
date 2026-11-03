"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AboutContent() {
  const { t } = useLanguage();
  const musicCategories = [
    { title: t('lofi'), description: t('lofiDescription') },
    { title: t('classical'), description: t('classicalDescription') },
    { title: t('afterhours'), description: t('jazzDescription') },
    { title: t('gregorian'), description: t('gregorianDescription') },
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 text-neutral-300">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white">{t('aboutTitle')}</h1>
        <p className="mt-4 leading-7">{t('aboutIntro')}</p>
      </header>

      <section className="mb-10" aria-labelledby="focus-cycle-heading">
        <h2 id="focus-cycle-heading" className="text-xl font-semibold text-white">{t('focusCycleTitle')}</h2>
        <p className="mt-3 leading-7">{t('focusCycleDescription')}</p>
      </section>

      <section aria-labelledby="focus-music-heading">
        <h2 id="focus-music-heading" className="text-xl font-semibold text-white">{t('musicTitle')}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {musicCategories.map((category) => (
            <article key={category.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-base font-semibold text-white">{category.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-300">{category.description}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
