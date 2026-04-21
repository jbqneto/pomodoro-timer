"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AboutContent() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 prose prose-invert">
      <header className="mb-10">
        <h1>{t('aboutTitle')}</h1>
        <p>{t('aboutIntro')}</p>
      </header>

      <section className="mb-10">
        <h2>{t('focusCycleTitle')}</h2>
        <p>{t('focusCycleDescription')}</p>
      </section>

      <section>
        <h2>{t('musicTitle')}</h2>
        <br />
        <article className="mb-8">
          <h3>Lo-fi</h3>
          <p>{t('lofiDescription')}</p>
        </article>

        <article className="mb-8">
          <h3>{t('classical')}</h3>
          <p>{t('classicalDescription')}</p>
        </article>

        <article>
          <h3>{t('catholic')}</h3>
          <p>{t('gregorianDescription')}</p>
        </article>
      </section>
    </section>
  );
}
