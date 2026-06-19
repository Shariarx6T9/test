import { ArrowRight, Clock, Train, CalendarBlank, CheckCircle, ClockCountdown } from '@phosphor-icons/react/dist/ssr'
import { formatDuration } from '@/lib/train-search'
import type { TrainSearchResult } from '@/lib/train-search'

interface Props {
  train:        TrainSearchResult
  railShebaUrl: string
  fromStation:  string
  toStation:    string
}

export default function TrainResultCard({ train, railShebaUrl, fromStation, toStation }: Props) {
  const typeLabel = formatTrainType(train.train_type)

  return (
    <article className="bg-bg-elevated border border-border-subtle rounded-xl p-5 sm:p-6 hover:border-primary/20 transition-colors">

      {/* Train name + type + verification badge */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Train size={14} className="text-primary flex-shrink-0" />
            <span className="text-text-tertiary font-mono text-xs">{train.train_number}</span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold font-inter rounded-sm">
              {typeLabel}
            </span>

            {train.verified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold font-inter rounded-sm">
                <CheckCircle size={11} weight="fill" />
                Verified Schedule
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent text-xs font-semibold font-inter rounded-sm">
                <ClockCountdown size={11} weight="bold" />
                Schedule details are being verified
              </span>
            )}
          </div>
          <h3 className="text-text-primary font-bold font-jakarta text-base leading-tight">
            {train.train_name_en}
          </h3>
        </div>

        {/* Buy Ticket — plain link per spec, no tracking params */}
        <a
          href={railShebaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center h-9 px-4 bg-primary text-white text-xs font-bold font-inter rounded-md hover:bg-primary-dim transition-colors"
          aria-label={`Buy ticket for ${train.train_name_en} on Rail Sheba`}
        >
          Buy Ticket ↗
        </a>
      </div>

      {train.verified ? (
        /* ── Tier 2: verified timetable — real times only ── */
        <div className="flex items-center gap-3 mb-4">
          <div className="text-center">
            <time
              dateTime={train.departure_time}
              className="font-mono font-bold text-text-primary text-xl leading-none"
            >
              {train.departure_time}
            </time>
            <p className="text-text-tertiary text-xs mt-0.5 font-inter">{fromStation}</p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1">
            <span className="text-text-tertiary text-xs font-inter flex items-center gap-1">
              <Clock size={11} />
              {formatDuration(train.duration_minutes)}
            </span>
            <div className="w-full flex items-center gap-1">
              <div className="h-px flex-1 bg-border-subtle" />
              <ArrowRight size={12} className="text-text-tertiary" />
            </div>
          </div>

          <div className="text-center">
            <time
              dateTime={train.arrival_time}
              className="font-mono font-bold text-text-primary text-xl leading-none"
            >
              {train.arrival_time}
            </time>
            <p className="text-text-tertiary text-xs mt-0.5 font-inter">{toStation}</p>
          </div>
        </div>
      ) : (
        /* ── Tier 1: route confirmed, no verified timing — never show a fake time ── */
        <div className="flex items-center gap-2 mb-4 py-3 px-3 bg-bg-card rounded-md border border-border-subtle">
          <Train size={16} className="text-text-tertiary flex-shrink-0" />
          <p className="text-text-secondary text-sm font-inter">
            {fromStation} <ArrowRight size={12} className="inline mx-1 -mt-0.5" /> {toStation}
          </p>
          <span className="text-text-tertiary text-xs font-inter ml-auto">
            Exact times not yet verified
          </span>
        </div>
      )}

      {/* Off days notice */}
      {train.off_days.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3">
          <CalendarBlank size={12} className="text-accent flex-shrink-0" />
          <span className="text-xs font-inter text-text-tertiary">
            Does not run on {train.off_days.map(capitalise).join(', ')}
          </span>
        </div>
      )}

      {/* Class/fare info is app-exclusive — intentional omission */}
      <span className="text-text-tertiary text-xs font-inter italic">
        Fares &amp; seat classes available in the app →
      </span>

      {!train.verified && (
        <p className="mt-3 text-text-tertiary text-xs font-inter leading-relaxed">
          This train operates on this route, but RailMate hasn&apos;t verified its exact
          departure and arrival times yet. Confirm timing with the station or official
          Bangladesh Railway channels before travel.
        </p>
      )}
    </article>
  )
}

function formatTrainType(type: string): string {
  const map: Record<string, string> = {
    intercity: 'Intercity',
    commuter:  'Commuter',
    special:   'Special',
    mail:      'Mail',
    local:     'Local',
  }
  return map[type.toLowerCase()] ?? type
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
