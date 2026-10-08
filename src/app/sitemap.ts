import type { MetadataRoute } from 'next';
import {
  indexablePages,
  languageAlternates,
  locales,
  pageUrl,
} from '@/utils/server';

export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePages.flatMap((page) =>
    locales.map((locale) => ({
      url: pageUrl(locale, page),
      alternates: { languages: languageAlternates(page) },
    }))
  );
}
