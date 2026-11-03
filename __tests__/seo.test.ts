import { describe, expect, it } from 'vitest';
import { pageMetadata, rootMetadata, SITE_URL, webApplicationJsonLd } from '@/lib/seo';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';

describe('SEO and multilingual routes', () => {
  it('creates canonical, reciprocal hreflang and localized metadata for both languages', () => {
    const english = pageMetadata('en', 'home');
    const portuguese = pageMetadata('pt', 'home');
    expect(english.alternates?.canonical).toBe(SITE_URL + '/');
    expect(portuguese.alternates?.canonical).toBe(SITE_URL + '/pt');
    expect(english.alternates?.languages).toEqual(portuguese.alternates?.languages);
    expect(english.alternates?.languages).toEqual({
      en: SITE_URL + '/',
      'pt-BR': SITE_URL + '/pt',
      'x-default': SITE_URL + '/',
    });
    expect(pageMetadata('pt', 'about').alternates?.canonical).toBe(SITE_URL + '/pt/about');
    expect(rootMetadata('pt').metadataBase?.toString()).toBe(SITE_URL + '/');
  });

  it('lists all four indexable pages in sitemap and declares sitemap in robots', () => {
    expect(sitemap().map((page) => page.url)).toEqual([
      SITE_URL + '/', SITE_URL + '/pt', SITE_URL + '/about', SITE_URL + '/pt/about',
    ]);
    expect(robots().sitemap).toBe(SITE_URL + '/sitemap.xml');
  });

  it('describes a free web app in valid localized JSON-LD', () => {
    const data = JSON.parse(webApplicationJsonLd('pt'));
    expect(data['@type']).toBe('WebApplication');
    expect(data.inLanguage).toBe('pt-BR');
    expect(data.url).toBe(SITE_URL + '/pt');
    expect(data.isAccessibleForFree).toBe(true);
  });
});
