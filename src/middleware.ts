let locales = ['en', 'es'];

function getLocale(request: { headers: { [x: string]: any } }) {
  let language = request.headers['accept-language'];
  let locale = locales.find((locale) => language.includes(locale));
  return locale || locales[0];
}

export function middleware(request: {
  nextUrl?: any;
  headers?: { [x: string]: any };
}) {
  const { pathname } = request.nextUrl;
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
