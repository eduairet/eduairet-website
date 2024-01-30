import { type NextRequest } from 'next/server';

export const locales = ['en', 'es'];
export const defaultLocale = locales[0];

export const getLocale = (request: NextRequest) => {
  let language = request.headers.get('accept-language') || '';
  if (language.includes('es')) return locales[1];
  return defaultLocale;
};
