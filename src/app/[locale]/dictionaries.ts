import 'server-only';
import { Dictionaries, Dictionary, Lang } from '@/models';

const dictionaries: Dictionaries = {
  en: () =>
    import('@/models/dictionaries/en.json').then(
      (module) => new Dictionary(module.default)
    ),
  es: () =>
    import('@/models/dictionaries/es.json').then(
      (module) => new Dictionary(module.default)
    ),
};

export const getDictionary = async (locale: Lang) => dictionaries[locale]();
