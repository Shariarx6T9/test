/**
 * RailMate Bangladesh — Locale detection middleware
 *
 * Detection priority:
 *   1. NLPX cookie (user explicitly switched language — always wins)
 *   2. CF-IPCountry header (Vercel exposes Cloudflare geo on all plans)
 *      → BD traffic defaults to Bengali
 *   3. Accept-Language header
 *   4. Fallback to defaultLocale ('bn')
 *
 * URL structure:
 *   /          → Bengali (default, no prefix)
 *   /en/...    → English
 *
 * This keeps URLs clean for the majority Bengali audience and lets
 * search engines index Bengali content at the canonical root.
 */
import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale, localePrefix } from '@/lib/i18n/navigation'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  // Keep next-intl's cookie-based detection — it handles the user's explicit
  // language switch (toggleLanguage in Navbar). We handle geo before calling
  // intlMiddleware so the cookie still wins when present.
  localeDetection: true,
  alternateLinks: true,
})

// Cookie name next-intl uses to persist the user's chosen locale.
// Must match what next-intl writes — it's 'NEXT_LOCALE' by default.
const LOCALE_COOKIE = 'NEXT_LOCALE'

export default function middleware(request: NextRequest): NextResponse {
  // 1. If user has an explicit cookie preference, let next-intl handle it.
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return intlMiddleware(request)
  }

  // 2. Geo detection via Cloudflare header (available on Vercel automatically).
  const country = request.headers.get('CF-IPCountry') ?? 
                  request.headers.get('x-vercel-ip-country') ?? ''

  if (country === 'BD') {
    // Bangladeshi traffic: inject bn preference so next-intl routes correctly
    const modifiedRequest = new Request(request.url, {
      headers: (() => {
        const h = new Headers(request.headers)
        h.set('accept-language', 'bn,en;q=0.5')
        return h
      })(),
      method:      request.method,
      body:        request.body,
      credentials: 'same-origin',
    })
    return intlMiddleware(modifiedRequest as NextRequest)
  }

  // 3. Non-BD traffic: let next-intl use Accept-Language + fallback to 'bn'.
  //    Most international users interested in BD railways likely read Bengali,
  //    but Accept-Language gives correct behaviour for English-only browsers.
  return intlMiddleware(request)
}

export const config = {
  // Match all paths except Next.js internals and static assets.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
