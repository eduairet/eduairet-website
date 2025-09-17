import { Dictionaries, Dictionary, Lang, EnContent, EsContent } from '@/models';

const dictionaries: Dictionaries = {
  en: new Dictionary(EnContent),
  es: new Dictionary(EsContent),
};

export const getDictionary = async (locale: Lang) => dictionaries[locale];
