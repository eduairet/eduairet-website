import { type NextRequest, NextResponse } from 'next/server';
import { locales, getLocale } from '@/utils/server/localization.utils';

const PUBLIC_FILE = /\.(.*)$/;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname === '/api' ||
    pathname.startsWith('/api/') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  // 302, not 308, and Vary: the target depends on Accept-Language.
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl, 302);
  response.headers.set('Vary', 'Accept-Language');
  return response;
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
