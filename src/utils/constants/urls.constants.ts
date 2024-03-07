import { Lang } from '@/models';

export const PageUrls = {
  locale: {
    en: '/en',
    es: '/es',
  },
  home: '/',
  home_(locale: Lang) {
    return `/${locale}`;
  },
  contact: '/contact',
  contact_(locale: Lang) {
    return `/${locale}/contact`;
  },
  resources: '/resources',
  resources_(locale: Lang) {
    return `/${locale}/resources`;
  },
};

export const ApiUrls = {
  contact: '/api/contact',
};
