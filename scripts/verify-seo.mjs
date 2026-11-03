import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const base = 'out';
const domain = 'https://focus.thedevlab.site';

function readExport(...candidates) {
  const path = candidates.map((file) => join(base, file)).find(existsSync);
  assert.ok(path, 'Expected generated HTML: ' + candidates.join(' or '));
  return readFileSync(path, 'utf8');
}

const cases = [
  { url: '/', language: 'en', marker: 'Free Pomodoro Timer with Music', paths: ['index.html'] },
  { url: '/pt', language: 'pt-BR', marker: 'Timer Pomodoro grátis com música', paths: ['pt.html', 'pt/index.html'] },
  { url: '/about', language: 'en', marker: 'Why Focus Beat exists', paths: ['about.html', 'about/index.html'] },
  { url: '/pt/about', language: 'pt-BR', marker: 'Por que o Focus Beat existe', paths: ['pt/about.html', 'pt/about/index.html'] },
];

for (const page of cases) {
  const html = readExport(...page.paths);
  assert.match(html, new RegExp('<html[^>]*lang="' + page.language + '"'), 'HTML lang for ' + page.url);
  assert.ok(html.includes(page.marker), 'Expected translated HTML content on ' + page.url);
  assert.ok(html.includes('rel="canonical"'), 'Expected canonical on ' + page.url);
  assert.ok(html.includes(domain + page.url), 'Expected canonical domain on ' + page.url);
  assert.match(html, /hreflang/i, 'Expected hreflang links on ' + page.url);
}

assert.ok(existsSync(join(base, 'robots.txt')), 'Missing robots.txt');
assert.ok(existsSync(join(base, 'sitemap.xml')), 'Missing sitemap.xml');
const sitemap = readFileSync(join(base, 'sitemap.xml'), 'utf8');
for (const page of cases) {
  assert.ok(sitemap.includes(domain + page.url), 'Missing ' + page.url + ' from sitemap');
}
console.log('SEO static export checks passed (4 pages, sitemap, robots).');
