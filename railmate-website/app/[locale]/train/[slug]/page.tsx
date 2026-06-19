import type { Metadata } from 'next'
import { notFound }      from 'next/navigation'
import { getStationsByCodes, searchTrains, TOP_ROUTES, formatDuration, getAllStations } from '@/lib/train-search'
import SearchForm from '@/components/search/SearchForm'
import TrainResultCard   from './TrainResultCard'

// ─── Caching ─────────────────────────────────────────────────────────────────
// ISR: revalidate every hour for on-demand routes.
// Top 40 pairs are prerendered at build time via generateStaticParams.
export const revalidate = 3600

// ─── Static params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return TOP_ROUTES.map(({ fromCode, toCode }) => ({
    slug: `${fromCode.toLowerCase()}-to-${toCode.toLowerCase()}`,
  }))
}

// ─── URL parsing ─────────────────────────────────────────────────────────────
// Slug format: "dhka-to-ctg" → fromCode=DHKA, toCode=CTG
function parseSlug(slug: string): { fromCode: string; toCode: string } | null {
  const match = slug.match(/^([a-z0-9]+)-to-([a-z0-9]+)$/)
  if (!match) return null
  return { fromCode: match[1].toUpperCase(), toCode: match[2].toUpperCase() }
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
  searchParams,
}: {
  params:       Promise<{ slug: string; locale: string }>
  searchParams: Promise<{ date?: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const parsed = parseSlug(slug)
  if (!parsed) return { title: 'Train Search | RailMate Bangladesh' }

  let route: Awaited<ReturnType<typeof getStationsByCodes>> = null
  try {
    route = await getStationsByCodes(parsed.fromCode, parsed.toCode)
  } catch (err) {
    console.error('[generateMetadata] getStationsByCodes failed:', err)
    return { title: 'Train Schedule | RailMate Bangladesh' }
  }
  if (!route) return { title: 'Route Not Found | RailMate Bangladesh' }

  const from = route.from.name_en
  const to   = route.to.name_en
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bhairail.vercel.app'

  return {
    title:       `${from} to ${to} Train Schedule | RailMate Bangladesh`,
    description: `Find train schedules from ${from} to ${to}. View departure times, journey duration, and available classes. Live delay reports available in the app.`,
    alternates: {
      canonical: `${siteUrl}/${locale}/train/${slug}`,
      languages: {
        'en': `${siteUrl}/en/train/${slug}`,
        'bn': `${siteUrl}/bn/train/${slug}`,
        'x-default': `${siteUrl}/bn/train/${slug}`,
      },
    },
    openGraph: {
      title:       `${from} to ${to} Train Schedule`,
      description: `Bangladesh Railway trains from ${from} to ${to}. Schedules, duration, and class availability.`,
      url:         `${siteUrl}/${locale}/train/${slug}`,
    },
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function TrainRoutePage({
  params,
  searchParams,
}: {
  params:       Promise<{ slug: string; locale: string }>
  searchParams: Promise<{ date?: string }>
}) {
  const { slug, locale } = await params
  const { date }         = await searchParams

  const parsed = parseSlug(slug)
  if (!parsed) notFound()

  let route:    Awaited<ReturnType<typeof getStationsByCodes>> = null
  let stations: Awaited<ReturnType<typeof getAllStations>>     = []
  let serviceError = false

  try {
    const [routeResult, stationsResult] = await Promise.all([
      getStationsByCodes(parsed.fromCode, parsed.toCode),
      getAllStations(),
    ])
    route    = routeResult
    stations = stationsResult
  } catch (err) {
    console.error('[TrainRoutePage] Supabase query failed:', err)
    serviceError = true
  }

  // Genuinely invalid route (codes don't exist) → 404.
  // Service failure (Supabase unreachable) → friendly error page, not a 404
  // and not an unhandled 500 — those are different failure modes.
  if (serviceError) {
    return (
      <main className="min-h-screen bg-bg-base pt-28 pb-20 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 text-center">
          <p className="text-text-primary font-bold font-jakarta text-xl mb-2">
            Schedule data is temporarily unavailable
          </p>
          <p className="text-text-secondary font-inter text-sm mb-6">
            We&apos;re having trouble reaching our train schedule database. Please try again in a moment.
          </p>
          <a
            href={`/${locale}/search`}
            className="inline-flex items-center h-11 px-5 bg-primary text-white font-bold font-inter text-sm rounded-md hover:bg-primary-dim transition-colors"
          >
            Back to search
          </a>
        </div>
      </main>
    )
  }

  if (!route) notFound()

  const journeyDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? date
    : new Date().toISOString().split('T')[0]

  let results: Awaited<ReturnType<typeof searchTrains>> = []
  try {
    results = await searchTrains(parsed.fromCode, parsed.toCode, journeyDate)
  } catch (err) {
    console.error('[TrainRoutePage] searchTrains failed — showing zero results:', err)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bhairail.vercel.app'
  // NOTE: The outbound ticket URL is set inside TrainResultCard.
  // It is https://eticket.railway.gov.bd (official BR e-ticketing portal).
  // ⚠️  HUMAN REVIEW: verify this URL is current before production launch.

  // JSON-LD structured data
  const jsonLd = {
    '@context':   'https://schema.org',
    '@type':      'ItemList',
    name:         `${route.from.name_en} to ${route.to.name_en} Train Schedule`,
    description:  `Bangladesh Railway trains from ${route.from.name_en} to ${route.to.name_en}`,
    url:          `${siteUrl}/${locale}/train/${slug}`,
    numberOfItems: results.length,
    itemListElement: results.map((train, i) => ({
      '@type':    'ListItem',
      position:   i + 1,
      item: {
        '@type':       'TrainTrip',
        name:           train.train_name_en,
        trainNumber:    String(train.train_number),
        // Only include real, verified times — never fabricate structured
        // data for routes RailMate hasn't verified the timetable for.
        ...(train.verified ? {
          departureTime: train.departure_time,
          arrivalTime:   train.arrival_time,
        } : {}),
        departureStation: {
          '@type': 'TrainStation',
          name:    route.from.name_en,
        },
        arrivalStation: {
          '@type': 'TrainStation',
          name:    route.to.name_en,
        },
      },
    })),
  }

  // Related routes for crawl discovery
  const relatedRoutes = getRelatedRoutes(parsed.fromCode, parsed.toCode)

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-bg-base pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="mb-6 text-xs text-text-tertiary font-inter flex items-center gap-2">
            <a href={`/${locale}`} className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <a href={`/${locale}/search`} className="hover:text-primary transition-colors">Search</a>
            <span>/</span>
            <span className="text-text-secondary">{route.from.name_en} → {route.to.name_en}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-inter">
              TRAIN SCHEDULE
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary font-jakarta">
              {route.from.name_en} <span className="text-text-tertiary font-light">to</span> {route.to.name_en}
            </h1>
            <p className="text-text-secondary font-inter text-sm mt-2">
              {results.length > 0
                ? `${results.length} train${results.length === 1 ? '' : 's'} on ${formatDisplayDate(journeyDate)}`
                : `No trains found on ${formatDisplayDate(journeyDate)}`
              }
            </p>
          </div>

          {/* Inline search — lets user change date without navigating away */}
          <div className="mb-8">
            <SearchForm
              stations={stations}
              defaultFrom={parsed.fromCode}
              defaultTo={parsed.toCode}
              defaultDate={journeyDate}
            />
          </div>

          {/* Results */}
          {results.length === 0 ? (
            <div className="text-center py-16 bg-bg-elevated rounded-xl border border-border-subtle">
              <p className="text-text-primary font-semibold font-jakarta text-lg mb-2">No trains found</p>
              <p className="text-text-secondary font-inter text-sm">
                No trains run on this route on {formatDisplayDate(journeyDate)}. Try a different date.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((train) => (
                <TrainResultCard
                  key={train.train_id}
                  train={train}
                  fromStation={route.from.name_en}
                  toStation={route.to.name_en}
                />
              ))}
            </div>
          )}

          {/* App upsell CTA — required by spec */}
          <div className="mt-10 p-6 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <p className="text-text-primary font-bold font-jakarta text-base mb-1">
                  Get full fare breakdown &amp; live delay reports
                </p>
                <p className="text-text-secondary font-inter text-sm">
                  The RailMate app shows exact fares for all 8 seat classes and
                  real-time delay reports from passengers currently on board.
                </p>
              </div>
              <a
                href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ?? '#download'}
                className="flex-shrink-0 inline-flex items-center gap-2 h-11 px-5 bg-primary text-white font-bold font-inter text-sm rounded-md hover:bg-primary-dim transition-colors whitespace-nowrap"
              >
                Download App
              </a>
            </div>
          </div>

          {/* Data notice */}
          <div className="mt-6 p-4 rounded-md text-xs text-text-tertiary font-inter leading-relaxed border border-border-subtle bg-bg-elevated">
            Schedule data sourced from Bangladesh Railway official publications.
            Always confirm departure times with the station or official channels before travel.
            RailMate is an independent platform and is not affiliated with Bangladesh Railway.
          </div>

          {/* Related routes — internal links for crawl discovery */}
          {relatedRoutes.length > 0 && (
            <div className="mt-10">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-widest font-inter mb-4">
                Related Routes
              </h2>
              <div className="flex flex-wrap gap-3">
                {relatedRoutes.map((r) => (
                  <a
                    key={r.slug}
                    href={`/${locale}/train/${r.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated border border-border-subtle rounded-full text-sm font-inter text-text-secondary hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    {r.label}
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDisplayDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const STATION_LABELS: Record<string, string> = {
  DHKA: 'Dhaka',
  CTG:  'Chittagong',
  SYT:  'Sylhet',
  KHU:  'Khulna',
  RAJ:  'Rajshahi',
  MYM:  'Mymensingh',
  DNJ:  'Dinajpur',
  RNG:  'Rangpur',
  COM:  'Comilla',
  JMP:  'Jamalpur',
  BOG:  'Bogura',
  CXBZ: 'Cox\'s Bazar',
  JS:   'Jessore',
  SRM:  'Sreemangal',
  AKH:  'Akhaura',
  BNP:  'Benapole',
  PCG:  'Panchagarh',
}

function getRelatedRoutes(fromCode: string, toCode: string) {
  // Pick 3 routes that share either the from or to station (cross-discovery)
  return TOP_ROUTES
    .filter(
      (r) =>
        (r.fromCode === fromCode || r.toCode === toCode || r.fromCode === toCode || r.toCode === fromCode) &&
        !(r.fromCode === fromCode && r.toCode === toCode)
    )
    .slice(0, 4)
    .map((r) => ({
      slug:  `${r.fromCode.toLowerCase()}-to-${r.toCode.toLowerCase()}`,
      label: `${STATION_LABELS[r.fromCode] ?? r.fromCode} → ${STATION_LABELS[r.toCode] ?? r.toCode}`,
    }))
}
