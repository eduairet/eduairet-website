import { type NextRequest } from 'next/server';
import type { Lang } from '@/models';

export const locales: Lang[] = ['en', 'es'];
export const defaultLocale = locales[0];

export const isLang = (value: string): value is Lang =>
  (locales as string[]).includes(value);

export const getLocale = (request: NextRequest) => {
  let language = request.headers.get('accept-language') || '';
  if (language.includes('es')) return locales[1];
  return defaultLocale;
};
