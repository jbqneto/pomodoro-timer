# SEO baseline (Focus Beat)

The canonical site is https://focus.thedevlab.site.

## Locale-aware static routes

- English (default): `/` and `/about`
- Brazilian Portuguese: `/pt` and `/pt/about`

Each locale has its own root layout (correct server-rendered HTML `lang`), translated copy and metadata. Language switches use real links, not only localStorage, and preserve whether the visitor is on Home or About. A saved browser language must not override a canonical URL.

The project uses `output: 'export'`: all indexable routes are pre-rendered at build time. When adding content pages, update `app/sitemap.ts`, `lib/seo.ts` and the relevant page components. Avoid making near-duplicate landing pages.

- Canonical and reciprocal hreflang: `lib/seo.ts`
- Robots: `app/robots.ts` -> `/robots.txt`
- Sitemap: `app/sitemap.ts` -> `/sitemap.xml`
- WebApplication JSON-LD: `lib/seo.ts`
- OG preview uses the existing logo; a dedicated 1200x630 social image is a follow-up improvement.

## Release verification

1. Run `npm run test:run` and `npm run build`.
2. Inspect generated `out/index.html`, `out/pt.html`, `out/about.html`, `out/pt/about.html` (or equivalent paths), checking language, title, description, canonical, hreflang, and meaningful content before JavaScript.
3. Confirm `/robots.txt`, `/sitemap.xml` and links are publicly accessible on the canonical domain.
4. Inspect both languages and the language toggle on desktop and mobile; verify settings, music consent, tasks, timers and history remain functional.
5. Add the canonical domain to Google Search Console; submit its sitemap and monitor indexing, impressions, queries and CWV.

No automated redirects based on IP or stored language. Keep alternate Vercel deployment URLs out of internal links and canonical tags.
