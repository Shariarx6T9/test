import { redirect } from 'next/navigation'
import { buildMetadata } from '@/lib/metadata'
import { getAllStations } from '@/lib/train-search'
import SearchForm from '@/components/search/SearchForm'

export const metadata = buildMetadata({
  title: 'Search Train Schedules',
  description: 'Search Bangladesh Railway train schedules by route and date. Find departure times, journey duration, and available classes across 50+ stations.',
  path: '/search',
})

// Prevent ISR caching of this page — it redirects when params are present,
// and the redirect target (train route page) handles its own caching.
export const dynamic = 'force-dynamic'

export default async function SearchPage({
  params: paramsPromise,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ from?: string; to?: string; date?: string }>
}) {
  const { locale } = await paramsPromise
  const sp = await searchParams

  // Auto-navigate to results when all three params are present — skip the
  // extra "click Search again" step the user would otherwise face.
  if (sp.from && sp.to && sp.date) {
    redirect(`/${locale}/train/${sp.from.toLowerCase()}-to-${sp.to.toLowerCase()}?date=${sp.date}`)
  }

  let stations: Awaited<ReturnType<typeof getAllStations>> = []
  try {
    stations = await getAllStations()
  } catch (err) {
    console.error('[SearchPage] getAllStations failed — rendering with empty list:', err)
  }

  return (
    <main className="min-h-screen bg-bg-base pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        <div className="mb-10">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-inter">
            TRAIN SCHEDULE SEARCH
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary font-jakarta mb-3">
            Find your train.
          </h1>
          <p className="text-text-secondary font-inter leading-relaxed">
            {stations.length > 0
              ? `Search Bangladesh Railway schedules across ${stations.length}+ stations.`
              : 'Search Bangladesh Railway schedules.'}
            {' '}Fares and live delay reports are available in the app.
          </p>
        </div>

        {/* Pre-fill from ?from=CODE&to=CODE&date=YYYY-MM-DD */}
        <SearchForm
          stations={stations}
          defaultFrom={sp.from?.toUpperCase()}
          defaultTo={sp.to?.toUpperCase()}
          defaultDate={sp.date}
        />

        <div className="mt-8 p-5 rounded-xl border border-border-subtle bg-bg-elevated flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary text-lg">📱</span>
          </div>
          <div>
            <p className="text-text-primary font-semibold font-inter text-sm">
              Get fare breakdowns &amp; live delay reports in the app
            </p>
            <p className="text-text-secondary font-inter text-xs mt-0.5">
              The RailMate app shows exact fares for all 8 classes and real-time community delay updates.
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}
