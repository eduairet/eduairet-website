import { notFound } from 'next/navigation';
import {
  Dictionaries,
  Dictionary,
  EnContent,
  EsContent,
  type Lang,
} from '@/models';
import { isLang } from '@/utils/server/localization.utils';

const dictionaries: Dictionaries = {
  en: new Dictionary(EnContent),
  es: new Dictionary(EsContent),
};

// Any first segment matches [locale]. A segment that is not a locale must 404.
export const toLang = (locale: string): Lang => {
  if (!isLang(locale)) notFound();
  return locale;
};

export const getDictionary = async (locale: string) =>
  dictionaries[toLang(locale)];
