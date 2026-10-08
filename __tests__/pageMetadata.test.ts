import { expect, test } from 'vitest';
import {
  buildPageMetadata,
  languageAlternates,
  siteMetadata,
} from '@/utils/server';
import { generateMetadata as resourcesMetadata } from '@/app/[locale]/resources/page';

const SITE = 'https://www.eduairet.com';

test.each([
  ['en', 'home', `${SITE}/en`, 'en_US', ['es_MX']],
  ['es', 'home', `${SITE}/es`, 'es_MX', ['en_US']],
  ['en', 'contact', `${SITE}/en/contact`, 'en_US', ['es_MX']],
  ['es', 'contact', `${SITE}/es/contact`, 'es_MX', ['en_US']],
] as const)(
  '%s %s points its canonical and og:url at itself',
  async (locale, page, url, ogLocale, alternateLocale) => {
    const metadata = await buildPageMetadata(locale, page);

    expect(metadata.alternates?.canonical).toBe(url);
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      url,
      siteName: 'Eduardo Aire Torres',
      locale: ogLocale,
      alternateLocale,
    });
    expect(metadata.robots).toBeUndefined();
  }
);

test('every page lists en, es and x-default with absolute www URLs', () => {
  expect(languageAlternates('home')).toEqual({
    en: `${SITE}/en`,
    es: `${SITE}/es`,
    'x-default': SITE,
  });
  expect(languageAlternates('contact')).toEqual({
    en: `${SITE}/en/contact`,
    es: `${SITE}/es/contact`,
    'x-default': `${SITE}/contact`,
  });
});

test('both locales of a page share the same hreflang set', async () => {
  const en = await buildPageMetadata('en', 'contact');
  const es = await buildPageMetadata('es', 'contact');
  expect(en.alternates?.languages).toEqual(es.alternates?.languages);
});

test('titles lead with the name on home and end with it elsewhere', async () => {
  expect((await buildPageMetadata('en', 'home')).title).toMatch(
    /^Eduardo Aire Torres \| /
  );
  expect((await buildPageMetadata('es', 'contact')).title).toBe(
    'Contacto | Eduardo Aire Torres'
  );
});

test('og and X images use the locale image with a localized alt', async () => {
  const metadata = await buildPageMetadata('es', 'home');
  const image = {
    url: '/es/opengraph-image',
    width: 1200,
    height: 630,
    alt: 'El logo de eat: letras claras dentro de un círculo negro.',
  };
  expect(metadata.openGraph?.images).toEqual([expect.objectContaining(image)]);
  expect(metadata.twitter).toMatchObject({
    card: 'summary_large_image',
    site: '@eduairet',
    images: [expect.objectContaining(image)],
  });
});

test('404s fall back to layout metadata: no canonical, hreflang, or robots override', () => {
  expect(siteMetadata.alternates).toBeUndefined();
  expect(siteMetadata.robots).toBeUndefined();
  expect(String(siteMetadata.metadataBase)).toBe(`${SITE}/`);
});

test('the unpublished resources page adds no metadata of its own', async () => {
  const metadata = await resourcesMetadata({
    params: Promise.resolve({ locale: 'en' }),
  });
  expect(metadata).toEqual({});
});

test('unknown locales 404 instead of building metadata', async () => {
  await expect(buildPageMetadata('wp-login.php', 'home')).rejects.toThrow(
    'NEXT_HTTP_ERROR_FALLBACK;404'
  );
});
