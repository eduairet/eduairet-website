import type { MetadataRoute } from 'next';
import {
  indexablePaths,
  locales,
  pathAlternates,
  pathUrl,
} from '@/utils/server';

export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePaths.flatMap(({ path, updated }) =>
    locales.map((locale) => ({
      url: pathUrl(locale, path),
      lastModified: updated,
      alternates: { languages: pathAlternates(path) },
    }))
  );
}
