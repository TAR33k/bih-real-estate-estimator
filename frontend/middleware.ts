import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'bs'],
 
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(bs|en)/:path*']
};