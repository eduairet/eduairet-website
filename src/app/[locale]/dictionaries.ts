import { notFound } from 'next/navigation';
import { Dictionaries, Dictionary, Lang, EnContent, EsContent } from '@/models';

const dictionaries: Dictionaries = {
  en: new Dictionary(EnContent),
  es: new Dictionary(EsContent),
};

// Paths the proxy lets through (dotted files, /_next/*) can reach [locale] with
// any segment, such as /wp-login.php; answer those with a 404, not a crash.
export const getDictionary = async (locale: Lang) => {
  if (!Object.hasOwn(dictionaries, locale)) notFound();
  return dictionaries[locale];
};
