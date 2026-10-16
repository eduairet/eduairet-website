import { Lang } from '@/models';

export const PagePaths = {
  home: '',
  projects: '/projects',
  contact: '/contact',
  privacy: '/privacy',
};

export type SitePage = keyof typeof PagePaths;

export const projectPath = (slug: string) => `${PagePaths.projects}/${slug}`;

export const PageUrls = {
  locale: {
    en: '/en',
    es: '/es',
  },
  home_(locale: Lang) {
    return `/${locale}${PagePaths.home}`;
  },
  projects_(locale: Lang) {
    return `/${locale}${PagePaths.projects}`;
  },
  project_(locale: Lang, slug: string) {
    return `/${locale}${projectPath(slug)}`;
  },
  contact_(locale: Lang) {
    return `/${locale}${PagePaths.contact}`;
  },
  privacy_(locale: Lang) {
    return `/${locale}${PagePaths.privacy}`;
  },
};

export const ApiUrls = {
  contact: '/api/contact',
};
