import { readdirSync } from 'node:fs';
import { expect, test } from 'vitest';
import { getPathMatch } from 'next/dist/shared/lib/router/utils/path-match';
import nextConfig from '../next.config.mjs';
import { oldPortfolioPages } from '../oldPortfolioPages.mjs';
import sitemap from '@/app/sitemap';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { feedPath, locales } from '@/utils/server';
import {
  ApiUrls,
  ARCHIVE_URL,
  PagePaths,
  PROJECTS,
  projectPath,
} from '@/utils/constants';

const redirects = ((await nextConfig.redirects?.()) ?? []).map((redirect) => ({
  ...redirect,
  matches: getPathMatch(redirect.source),
}));

const redirectFor = (path: string) =>
  redirects.find(({ matches }) => matches(path) !== false);

test.each([
  ...oldPortfolioPages.map((slug) => [`/${slug}`, `${ARCHIVE_URL}/${slug}`]),
  ...['/resources', '/en/resources', '/es/resources'].map((path) => [
    path,
    `${ARCHIVE_URL}/resources`,
  ]),
  ['/home', '/'],
  ['/about', '/#about'],
  ['/work', '/projects'],
])('%s redirects permanently to %s', (path, destination) => {
  expect(redirectFor(path)).toMatchObject({ destination, permanent: true });
});

test('no redirect points at the old myportfolio hosts', () => {
  for (const { destination } of redirects)
    expect(destination).not.toMatch(/myportfolio\.com/);
});

const appRoutes = readdirSync('src/app', { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('['))
  .map(({ name }) => `/${name}`);

const publicFiles = readdirSync('public', { recursive: true }).map(
  (name) => `/${String(name).replace(/\\/g, '/')}`
);

const pagePaths = [
  ...Object.values(PagePaths),
  ...PROJECTS.map(({ slug }) => projectPath(slug)),
];

const sitePaths = new Set([
  '/',
  ApiUrls.contact,
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icon.svg',
  '/apple-icon.png',
  ...appRoutes,
  ...publicFiles,
  ...sitemap().map(({ url }) => new URL(url).pathname),
  ...pagePaths.filter(Boolean),
  ...locales.flatMap((locale) => [
    `/${locale}`,
    feedPath(locale),
    `/${locale}/opengraph-image`,
    ...pagePaths.map((path) => `/${locale}${path}`),
  ]),
]);

test.each([...sitePaths])(
  '%s is served by the new site, not redirected',
  (path) => {
    expect(redirectFor(path)).toBeUndefined();
  }
);

test.each([
  'brief-form-spanish',
  'cheschistz',
  'covid-19-in-mexico-a-year-in-poster-series',
  'hexis',
  'kiss-me-im-da-butcher',
  'lagrimasdecocodrilo',
  'letters',
  'picnic-geeks-by-eat',
  'quesadillitas-friday',
  'redesign-form-spanish',
  'semana-ov-anahuac-2020',
  'site',
])('/%s is gone from the archive, so it stays a 404', (slug) => {
  expect(redirectFor(`/${slug}`)).toBeUndefined();
});

test.each([
  '/fr/resources',
  '/en/resources/old',
  '/en/freedom',
  '/freedom/old',
])('%s is not redirected', (path) => {
  expect(redirectFor(path)).toBeUndefined();
});

test.each(locales)(
  'the %s Experience card links to the archive',
  async (locale) => {
    const { experience } = await getDictionary(locale);
    expect(experience.items).toContainEqual(
      expect.objectContaining({
        company: 'archive.eduairet.com',
        companyUrl: ARCHIVE_URL,
      })
    );
  }
);
