import 'server-only';
import { Lang } from '@/models';

const dictionaries = {
  en: () => import('@/models/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/models/dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: Lang) => dictionaries[locale]();
