/**
 * Locale middleware — redirects / to /bn/ for BD traffic (and as default).
 * Non-BD browsers with an English Accept-Language header get /en/.
 * User's explicit cookie choice (NEXT_LOCALE) always wins.
 */
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale, localePrefix } from '@/lib/i18n/navigation'

export default createMiddleware({
  locales,
  defaultLocale,   // 'bn'
  localePrefix,    // 'always'
  localeDetection: true,  // honour Accept-Language; BD browsers usually send bn
  alternateLinks:  true,
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
