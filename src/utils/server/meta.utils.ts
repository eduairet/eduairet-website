import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { Lang } from '@/models';
import { getDictionary, toLang } from '@/app/[locale]/dictionaries';
import {
  findProject,
  OG_IMAGE_SIZE,
  OpenGraphLocales,
  PagePaths,
  PAGES_UPDATED,
  PROJECTS,
  projectFile,
  projectPath,
  SITE_NAME,
  SITE_URL,
  THEME_COLORS,
  X_HANDLE,
  type SitePage,
} from '@/utils/constants';
import { locales } from './localization.utils';

export const indexablePages: SitePage[] = [
  'home',
  'projects',
  'contact',
  'privacy',
];

// Every indexable path without its locale, with the date its content last changed.
export const indexablePaths = [
  ...indexablePages.map((page) => ({
    path: PagePaths[page],
    updated: PAGES_UPDATED[page],
  })),
  ...PROJECTS.map(({ slug, updated }) => ({
    path: projectPath(slug),
    updated,
  })),
];

export const pathUrl = (locale: Lang, path: string) =>
  `${SITE_URL}/${locale}${path}`;

export const pageUrl = (locale: Lang, page: SitePage) =>
  pathUrl(locale, PagePaths[page]);

export const projectUrl = (locale: Lang, slug: string) =>
  pathUrl(locale, projectPath(slug));

export function projectOr404(slug: string) {
  const project = findProject(slug);
  if (!project) notFound();
  return project;
}

export const pathAlternates = (path: string) => ({
  ...Object.fromEntries(
    locales.map((locale) => [locale, pathUrl(locale, path)])
  ),
  'x-default': `${SITE_URL}${path}`,
});

export const feedPath = (locale: Lang) => `/${locale}/feed.xml`;

interface ShareImage {
  url: string;
  alt: string;
}

async function buildMetadata(
  locale: Lang,
  path: string,
  { title, description }: { title: string; description: string },
  share?: ShareImage
): Promise<Metadata> {
  const content = await getDictionary(locale);
  const url = pathUrl(locale, path);
  // A page-level openGraph drops the opengraph-image file, so link it here.
  const images = [
    share
      ? { ...share, ...OG_IMAGE_SIZE, type: 'image/jpeg' }
      : {
          url: `/${locale}/opengraph-image`,
          ...OG_IMAGE_SIZE,
          alt: content.meta.ogImageAlt,
          type: 'image/png',
        },
  ];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: pathAlternates(path),
      types: {
        'application/rss+xml': [
          { url: feedPath(locale), title: content.projects.feed },
        ],
      },
    },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      locale: OpenGraphLocales[locale],
      alternateLocale: locales
        .filter((other) => other !== locale)
        .map((other) => OpenGraphLocales[other]),
      title,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      site: X_HANDLE,
      creator: X_HANDLE,
      title,
      description,
      images,
    },
  };
}

export async function buildPageMetadata(
  localeParam: string,
  page: SitePage
): Promise<Metadata> {
  const locale = toLang(localeParam);
  const content = await getDictionary(locale);
  return buildMetadata(locale, PagePaths[page], content.meta[page]);
}

export const projectShareImage = (slug: string) => projectFile(slug, 'og.jpg');

export async function buildProjectMetadata(
  localeParam: string,
  slug: string
): Promise<Metadata> {
  const locale = toLang(localeParam);
  projectOr404(slug);
  const content = await getDictionary(locale);
  const { title, summary, shareAlt } = content.projects.items[slug];
  return buildMetadata(
    locale,
    projectPath(slug),
    { title: `${title} | ${SITE_NAME}`, description: summary },
    { url: projectShareImage(slug), alt: shareAlt }
  );
}

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  applicationName: SITE_NAME,
};

export const viewport: Viewport = {
  // Dark is the default theme; the theme script switches it before paint.
  themeColor: THEME_COLORS.dark,
};
