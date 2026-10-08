import type { Metadata, Viewport } from 'next';
import type { Lang } from '@/models';
import { getDictionary, toLang } from '@/app/[locale]/dictionaries';
import {
  Colors,
  OG_IMAGE_SIZE,
  OpenGraphLocales,
  PagePaths,
  RESOURCES_PUBLISHED,
  SITE_NAME,
  SITE_URL,
  X_HANDLE,
  type SitePage,
} from '@/utils/constants';
import { locales } from './localization.utils';

export interface LocaleProps {
  params: Promise<{ locale: string }>;
}

export const indexablePages: SitePage[] = [
  'home',
  'contact',
  ...(RESOURCES_PUBLISHED ? (['resources'] as const) : []),
];

export const pageUrl = (locale: Lang, page: SitePage) =>
  `${SITE_URL}/${locale}${PagePaths[page]}`;

// The unprefixed path redirects by Accept-Language, which is what x-default is for.
export const languageAlternates = (page: SitePage) => ({
  ...Object.fromEntries(
    locales.map((locale) => [locale, pageUrl(locale, page)])
  ),
  'x-default': `${SITE_URL}${PagePaths[page]}`,
});

export async function buildPageMetadata(
  localeParam: string,
  page: SitePage
): Promise<Metadata> {
  const locale = toLang(localeParam);
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
