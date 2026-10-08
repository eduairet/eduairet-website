import type { MetadataRoute } from 'next';
import {
  indexablePages,
  languageAlternates,
  locales,
  pageUrl,
} from '@/utils/server';

// Google ignores priority and changefreq; lastModified is left out until it can be accurate.
export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePages.flatMap((page) =>
    locales.map((locale) => ({
      url: pageUrl(locale, page),
      alternates: { languages: languageAlternates(page) },
    }))
  );
}
