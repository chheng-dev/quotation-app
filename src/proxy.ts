import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const regularToken = req.cookies.get('accessToken')?.value;

  let pathWithoutLocale = pathname;
  let currentLocale = 'en';
  let hasLocaleInPath = false;

  const locales = ['en', 'km'];
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      pathWithoutLocale = pathname.substring(`/${locale}`.length);
      currentLocale = locale;
      hasLocaleInPath = true;
      break;
    } else if (pathname === `/${locale}`) {
      pathWithoutLocale = '/';
      currentLocale = locale;
      hasLocaleInPath = true;
      break;
    }
  }

  const protectedPaths = ['/admin', '/profile', '/warehouse'];
  const isProtectedPath = protectedPaths.some((path) => pathWithoutLocale.startsWith(path));
  const authPaths = ['/login', '/register'];
  const isAuthPath = authPaths.some((path) => pathWithoutLocale === path);

  if (!hasLocaleInPath && (isProtectedPath || isAuthPath)) {
    return NextResponse.redirect(new URL(`/${currentLocale}${pathname}`, req.url));
  }

  if (isAuthPath && regularToken) {
    return NextResponse.redirect(new URL(`/${currentLocale}/admin`, req.url));
  }

  if (isProtectedPath) {
    if (!regularToken) {
      const loginUrl = new URL(`/${currentLocale}/login`, req.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
