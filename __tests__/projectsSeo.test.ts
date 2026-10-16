import { existsSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';
import { GET as feed } from '@/app/[locale]/feed.xml/route';
import { Dictionary, EnContent, EsContent } from '@/models';
import { PROJECTS } from '@/utils/constants';
import { buildPageMetadata, buildProjectMetadata } from '@/utils/server';
import {
  buildProjectsStructuredData,
  buildProjectStructuredData,
} from '@/utils/server/structuredData.utils';

const SITE = 'https://www.eduairet.com';
const content = {
  en: new Dictionary(EnContent),
  es: new Dictionary(EsContent),
};

const readFeed = async (locale: string) => {
  const res = await feed(new Request(`${SITE}/${locale}/feed.xml`), {
    params: Promise.resolve({ locale }),
  });
  return { res, body: await res.text() };
};

test.each(['en', 'es'] as const)(
  'the %s feed is RSS 2.0 with every project, newest first',
  async (locale) => {
    const { res, body } = await readFeed(locale);

    expect(res.headers.get('content-type')).toBe(
      'application/rss+xml; charset=utf-8'
    );
    expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
      true
    );
    expect(body).toContain(
      `<atom:link href="${SITE}/${locale}/feed.xml" rel="self" type="application/rss+xml"/>`
    );
    expect(body).toContain(`<language>${locale}</language>`);
    const links = [
      ...body.matchAll(
        /<item>\s*<title>[^<]*<\/title>\s*<link>([^<]*)<\/link>/g
      ),
    ].map((m) => m[1]);
    expect(links).toEqual(
      PROJECTS.map(({ slug }) => `${SITE}/${locale}/projects/${slug}`)
    );
    // Titles and summaries are escaped, so quotes and ampersands stay valid XML.
    expect(body).not.toMatch(/<description>[^<]*["'][^<]*<\/description>/);
  }
);

test('an unknown locale has no feed', async () => {
  await expect(readFeed('fr')).rejects.toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
});

test('every page links its language feed', async () => {
  for (const locale of ['en', 'es'] as const) {
    const metadata = await buildPageMetadata(locale, 'home');
    expect(metadata.alternates?.types).toEqual({
      'application/rss+xml': [
        { url: `/${locale}/feed.xml`, title: content[locale].projects.feed },
      ],
    });
  }
});

test.each(PROJECTS.map(({ slug }) => slug))(
  '%s shares its own image, which exists, with alt text in both languages',
  async (slug) => {
    expect(
      existsSync(path.join(process.cwd(), 'public', 'projects', slug, 'og.jpg'))
    ).toBe(true);
    for (const locale of ['en', 'es'] as const) {
      const metadata = await buildProjectMetadata(locale, slug);
      const image = {
        url: `/projects/${slug}/og.jpg`,
        width: 1200,
        height: 630,
        alt: content[locale].projects.items[slug].shareAlt,
        type: 'image/jpeg',
      };
      expect(content[locale].projects.items[slug].shareAlt).not.toBe('');
      expect(metadata.openGraph?.images).toEqual([image]);
      expect(metadata.twitter).toMatchObject({ images: [image] });
    }
  }
);

test('/projects lists every project in an ItemList, with breadcrumbs', async () => {
  const data = await buildProjectsStructuredData('es');
  const page = data['@graph'].find(
    (node) => node['@type'] === 'CollectionPage'
  );
  const crumbs = data['@graph'].find(
    (node) => node['@type'] === 'BreadcrumbList'
  );

  expect(page).toMatchObject({
    url: `${SITE}/es/projects`,
    inLanguage: 'es',
    author: { '@id': `${SITE}/#person` },
  });
  expect(
    (
      page as { mainEntity: { itemListElement: { url: string }[] } }
    ).mainEntity.itemListElement.map(({ url }) => url)
  ).toEqual(PROJECTS.map(({ slug }) => `${SITE}/es/projects/${slug}`));
  expect(crumbs).toMatchObject({
    itemListElement: [
      { position: 1, name: 'Inicio', item: `${SITE}/es` },
      { position: 2, name: 'Proyectos', item: `${SITE}/es/projects` },
    ],
  });
});

test.each(PROJECTS.map((project) => [project.slug, project] as const))(
  '%s is a CreativeWork by me, with its dates, image and links',
  async (slug, project) => {
    const data = await buildProjectStructuredData('en', slug);
    const work = data['@graph'].find(
      (node) => node['@type'] === 'CreativeWork'
    );

    expect(work).toMatchObject({
      '@id': `${SITE}/en/projects/${slug}#work`,
      name: content.en.projects.items[slug].title,
      description: content.en.projects.items[slug].summary,
      dateCreated: project.started,
      dateModified: project.updated,
      image: `${SITE}/projects/${slug}/og.jpg`,
      author: { '@id': `${SITE}/#person` },
    });
    expect((work as { sameAs?: string[] }).sameAs).toEqual(
      project.links.length ? project.links.map(({ href }) => href) : undefined
    );
  }
);
