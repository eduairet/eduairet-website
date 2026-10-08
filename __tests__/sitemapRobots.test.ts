import { expect, test } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import manifest from '@/app/manifest';

const SITE = 'https://www.eduairet.com';

test('sitemap lists only the indexable pages', () => {
  expect(sitemap().map((entry) => entry.url)).toEqual([
    `${SITE}/en`,
    `${SITE}/es`,
    `${SITE}/en/contact`,
    `${SITE}/es/contact`,
  ]);
});

test('every sitemap entry carries en, es and x-default alternates', () => {
  for (const entry of sitemap()) {
    const languages = entry.alternates?.languages ?? {};
    expect(Object.keys(languages).sort()).toEqual(['en', 'es', 'x-default']);
    expect(Object.values(languages)).toContain(entry.url);
  }
});

test('sitemap leaves out fields Google ignores or that could be wrong', () => {
  for (const entry of sitemap()) {
    expect(entry).not.toHaveProperty('priority');
    expect(entry).not.toHaveProperty('changeFrequency');
    expect(entry).not.toHaveProperty('lastModified');
  }
});

test('robots.txt allows the site, blocks the API, and points to the sitemap', () => {
  expect(robots()).toEqual({
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${SITE}/sitemap.xml`,
  });
});

test('manifest uses the site name and separate any and maskable icons', () => {
  const { name, short_name, id, scope, lang, icons } = manifest();
  expect({ name, short_name, id, scope, lang }).toEqual({
    name: 'Eduardo Aire Torres',
    short_name: 'eat',
    id: '/',
    scope: '/',
    lang: 'en',
  });
  expect(icons?.map(({ sizes, purpose }) => `${sizes} ${purpose}`)).toEqual([
    '192x192 any',
    '512x512 any',
    '192x192 maskable',
    '512x512 maskable',
  ]);
});
