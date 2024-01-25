import { NextRequest } from 'next/server';

let locales = ['en', 'es'];

function getLocale(request: { headers: { [x: string]: any } }) {
  let language = request.headers['accept-language'];
  if (!language) return locales[0];
  let locale = locales.find((locale) => locale.includes(language));
  return locale || locales[0];
}

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;
  const locale = getLocale({ headers: request.headers || {} });
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return Response.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
