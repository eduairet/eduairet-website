import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { Lang } from '@/models';
import { getDictionary } from '@/app/[locale]/dictionaries';
import {
  Colors,
  OG_IMAGE_SIZE,
  OpenGraphLocales,
  RESOURCES_PUBLISHED,
  SITE_NAME,
  SITE_URL,
  X_HANDLE,
} from '@/utils/constants';
import { isLang, locales } from './localization.utils';

export interface LocaleParams {
  params: Promise<{ locale: string }>;
}

const pagePaths = {
  home: '',
  contact: '/contact',
  resources: '/resources',
};

export type SitePage = keyof typeof pagePaths;

export const indexablePages: SitePage[] = RESOURCES_PUBLISHED
  ? ['home', 'contact', 'resources']
  : ['home', 'contact'];

export const pageUrl = (locale: Lang, page: SitePage) =>
  `${SITE_URL}/${locale}${pagePaths[page]}`;

// x-default is the unprefixed path, which the proxy redirects by Accept-Language.
export const languageAlternates = (page: SitePage) => ({
  ...Object.fromEntries(
    locales.map((locale) => [locale, pageUrl(locale, page)])
  ),
  'x-default': `${SITE_URL}${pagePaths[page] || '/'}`,
});

export async function buildPageMetadata(
  locale: string,
  page: SitePage
): Promise<Metadata> {
  if (!isLang(locale)) notFound();
  const content = await getDictionary(locale);
  const { title, description } = content.meta[page];
  const url = pageUrl(locale, page);
  // A page-level openGraph replaces the segment's opengraph-image, so link it here.
  const images = [
    {
      url: `/${locale}/opengraph-image`,
      ...OG_IMAGE_SIZE,
      alt: content.meta.ogImageAlt,
      type: 'image/png',
    },
  ];

  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(page) },
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

export async function buildNotFoundMetadata(locale: string): Promise<Metadata> {
  const content = await getDictionary(locale);
  return {
    title: content.meta.notFound.title,
    description: content.meta.notFound.description,
    robots: { index: false, follow: true },
  };
}

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  applicationName: SITE_NAME,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: Colors.white },
    { media: '(prefers-color-scheme: dark)', color: Colors.black },
  ],
};
