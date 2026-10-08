import { Lang } from '@/models';

export const PagePaths = {
  home: '',
  contact: '/contact',
  resources: '/resources',
};

export type SitePage = keyof typeof PagePaths;

export const PageUrls = {
  locale: {
    en: '/en',
    es: '/es',
  },
  home_(locale: Lang) {
    return `/${locale}${PagePaths.home}`;
  },
  contact_(locale: Lang) {
    return `/${locale}${PagePaths.contact}`;
  },
};

export const ApiUrls = {
  contact: '/api/contact',
};
