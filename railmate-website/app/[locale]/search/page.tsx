import type { Metadata } from 'next'
import { getAllStations } from '@/lib/train-search'
import SearchForm from '@/components/search/SearchForm'

export const metadata: Metadata = {
  title: 'Search Train Schedules | RailMate Bangladesh',
  description:
    'Search Bangladesh Railway train schedules by route and date. Find departure times, journey duration, and available classes across 50+ stations.',
}

// Revalidate station list every hour — stations don't change often
export const revalidate = 3600

export default async function SearchPage() {
  const stations = await getAllStations()

  return (
    <main className="min-h-screen bg-bg-base pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-10">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-inter">
            TRAIN SCHEDULE SEARCH
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary font-jakarta mb-3">
            Find your train.
          </h1>
          <p className="text-text-secondary font-inter leading-relaxed">
            Search Bangladesh Railway schedules across {stations.length}+ stations.
            Fares and live delay reports are available in the app.
          </p>
        </div>

        <SearchForm stations={stations} />

        {/* App upsell */}
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
