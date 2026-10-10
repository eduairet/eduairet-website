import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import JsonLd from '@/components/metadata/JsonLd';
import {
  buildHomeStructuredData,
  serializeJsonLd,
} from '@/utils/server/structuredData.utils';

const SITE = 'https://www.eduairet.com';

test.each(['en', 'es'])(
  '%s home has one WebSite and one ProfilePage',
  async (locale) => {
    const data = await buildHomeStructuredData(locale);
    const [website, profile] = data['@graph'];

    expect(data['@context']).toBe('https://schema.org');
    expect(website).toEqual({
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      name: 'Eduardo Aire Torres',
      alternateName: 'eat',
      url: `${SITE}/`,
      inLanguage: ['en', 'es'],
    });
    expect(profile).toMatchObject({
      '@type': 'ProfilePage',
      url: `${SITE}/${locale}`,
      inLanguage: locale,
      isPartOf: { '@id': `${SITE}/#website` },
      mainEntity: {
        '@type': 'Person',
        '@id': `${SITE}/#person`,
        name: 'Eduardo Aire Torres',
        image: `${SITE}/eduardo-aire-torres.webp`,
        sameAs: [
          'https://github.com/eduairet',
          'https://www.linkedin.com/in/eduairet/',
          'https://x.com/eduairet',
          'https://www.instagram.com/eduairet/',
        ],
      },
    });
  }
);

test('Person text comes from what the page shows', async () => {
  const { mainEntity } = (await buildHomeStructuredData('es'))['@graph'][1];
  expect(mainEntity.jobTitle).toEqual([
    'Ingeniero de Diseño',
    'Ingeniero de Producto',
  ]);
  expect(mainEntity.description).toMatch(/^Soy ingeniero de diseño/);
});

test('both locales share the same WebSite node', async () => {
  const en = (await buildHomeStructuredData('en'))['@graph'][0];
  const es = (await buildHomeStructuredData('es'))['@graph'][0];
  expect(en).toEqual(es);
});

test('serialized JSON-LD cannot close the script tag', () => {
  const json = serializeJsonLd({ name: '</script><script>alert(1)</script>' });
  expect(json).not.toContain('<');
  expect(JSON.parse(json).name).toBe('</script><script>alert(1)</script>');
});

test('JsonLd renders one application/ld+json script', () => {
  const html = renderToStaticMarkup(
    <JsonLd data={{ '@type': 'Thing', name: 'a<b' }} />
  );
  expect(html).toBe(
    '<script type="application/ld+json">{"@type":"Thing","name":"a\\u003cb"}</script>'
  );
});
