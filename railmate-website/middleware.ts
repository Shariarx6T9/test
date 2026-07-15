/**
 * RailMate Bangladesh — Website middleware
 *
 * Responsibilities:
 *  1. Locale routing (next-intl) — redirect / to /bn/ for BD traffic
 *  2. Per-IP rate limiting on public train search paths
 *     - /[locale]/train/[slug]
 *     - /[locale]/search
 *     These are the unauthenticated, public-facing search surfaces.
 *     Per Master Reference Part 05 §5.6 and Part 08 §8.4:
 *     "per-IP rate limiting is required, not optional — build the limiter
 *      alongside the feature, not after it gets abused."
 *
 * Rate limit: 30 requests / 60 seconds per IP on search paths.
 * Uses Upstash Redis in production (UPSTASH_REDIS_REST_URL +
 * UPSTASH_REDIS_REST_TOKEN env vars). Falls back to in-memory if not
 * configured — in-memory does NOT persist across Vercel serverless
 * invocations, so configure Upstash before any traffic push.
 */
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale, localePrefix } from '@/lib/i18n/navigation'

// ─── Locale middleware (next-intl) ────────────────────────────────────────────

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,   // 'bn'
  localePrefix,    // 'always'
  // Part 05 §5.4 requires defaulting to Bengali for BD traffic — a
  // geographic requirement. localeDetection:true instead honors the
  // browser's Accept-Language header, which is 'en-US' on most BD
  // devices/browsers regardless of the user's actual location or
  // language preference. That silently overrode defaultLocale and was
  // why the site rendered in English. Disabling it lets defaultLocale
  // ('bn') win on first visit; users who explicitly switch still get
  // their choice persisted via the NEXT_LOCALE cookie on return visits.
  localeDetection: false,
  alternateLinks:  true,
})

// ─── Rate limiting ────────────────────────────────────────────────────────────

const SEARCH_RATE_LIMIT = {
  requests:      30,
  windowSeconds: 60,
} as const

/** Paths that require per-IP rate limiting. Matches after locale prefix. */
function isSearchPath(pathname: string): boolean {
  // Match /en/train/... or /bn/train/... or /en/search or /bn/search
  return /^\/[a-z]{2}\/(train\/|search)/.test(pathname)
}

/** Extract client IP, preferring x-forwarded-for (Vercel sets this). */
function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  return xff?.split(',')[0]?.trim() ?? realIp ?? 'unknown'
}

// ── In-memory fallback (dev / no Upstash configured) ─────────────────────────
// WARNING: does not share state across Vercel serverless instances.
// Configure Upstash for production.
interface MemEntry { count: number; resetAt: number }
const memStore = new Map<string, MemEntry>()

function inMemoryRateLimit(key: string): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const windowMs = SEARCH_RATE_LIMIT.windowSeconds * 1_000
  const entry = memStore.get(key)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs
    memStore.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: SEARCH_RATE_LIMIT.requests - 1, reset: resetAt }
  }

  if (entry.count >= SEARCH_RATE_LIMIT.requests) {
    return { allowed: false, remaining: 0, reset: entry.resetAt }
  }

  entry.count += 1
  return { allowed: true, remaining: SEARCH_RATE_LIMIT.requests - entry.count, reset: entry.resetAt }
}

// ── Upstash Redis rate limit (production) ─────────────────────────────────────
async function upstashRateLimit(
  key: string
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const url   = process.env.UPSTASH_REDIS_REST_URL!
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!

  const pipeline = [
    ['INCR', key],
    ['EXPIRE', key, String(SEARCH_RATE_LIMIT.windowSeconds)],
    ['TTL', key],
  ]

  const res = await fetch(`${url}/pipeline`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pipeline),
  })

  if (!res.ok) {
    // Fail open — allow request if Redis is unavailable
    console.error('[RateLimit] Upstash error:', res.status)
    return { allowed: true, remaining: SEARCH_RATE_LIMIT.requests, reset: Date.now() }
  }

  const data  = (await res.json()) as Array<{ result: number }>
  const count = data[0]?.result ?? 1
  const ttl   = data[2]?.result ?? SEARCH_RATE_LIMIT.windowSeconds
  const reset = Date.now() + ttl * 1_000

  if (count > SEARCH_RATE_LIMIT.requests) {
    return { allowed: false, remaining: 0, reset }
  }
  return { allowed: true, remaining: SEARCH_RATE_LIMIT.requests - count, reset }
}

async function checkRateLimit(
  req: NextRequest
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const ip  = getClientIp(req)
  const key = `railmate:search:${ip}`

  const hasUpstash =
    !!process.env.UPSTASH_REDIS_REST_URL &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN

  if (!hasUpstash && process.env.NODE_ENV === 'production') {
    console.warn(
      '[RateLimit] UPSTASH_REDIS_REST_URL/TOKEN not set. ' +
      'In-memory rate limiting does NOT persist across serverless instances. ' +
      'Configure Upstash Redis before any traffic push.'
    )
  }

  try {
    return hasUpstash
      ? await upstashRateLimit(key)
      : inMemoryRateLimit(key)
  } catch (err) {
    console.error('[RateLimit] Unexpected error:', err)
    return { allowed: true, remaining: SEARCH_RATE_LIMIT.requests, reset: Date.now() }
  }
}

// ─── Combined middleware ──────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Apply rate limiting on search paths BEFORE locale handling.
  if (isSearchPath(pathname)) {
    const { allowed, remaining, reset } = await checkRateLimit(req)

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please wait a moment and try again.' }),
        {
          status: 429,
          headers: {
            'Content-Type':      'application/json',
            'X-RateLimit-Limit': String(SEARCH_RATE_LIMIT.requests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(reset / 1000)),
            'Retry-After':       String(SEARCH_RATE_LIMIT.windowSeconds),
          },
        }
      )
    }

    // Attach remaining header to passing requests for observability
    const res = await intlMiddleware(req)
    res.headers.set('X-RateLimit-Limit',     String(SEARCH_RATE_LIMIT.requests))
    res.headers.set('X-RateLimit-Remaining', String(remaining))
    res.headers.set('X-RateLimit-Reset',     String(Math.ceil(reset / 1000)))
    return res
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
