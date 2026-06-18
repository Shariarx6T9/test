import { ArrowRight, Clock, Train, CalendarBlank } from '@phosphor-icons/react/dist/ssr'
import { formatDuration } from '@/lib/train-search'
import type { TrainSearchResult } from '@/lib/train-search'

interface Props {
  train:        TrainSearchResult
  railShebaUrl: string
  fromStation:  string
  toStation:    string
}

// Class display names — concise chips, never show prices
const CLASS_LABELS: Record<string, string> = {
  SHOVON:       'শোভন',
  SHOVON_CHAIR: 'শোভন চেয়ার',
  S_CHAIR:      'শোভন চেয়ার',
  SNIGDHA:      'স্নিগ্ধা',
  AC_BERTH:     'AC বার্থ',
  AC_B:         'AC বার্থ',
  AC_SEAT:      'AC আসন',
  AC_S:         'AC আসন',
  FIRST_BERTH:  '১ম বার্থ',
  F_BERTH:      '১ম বার্থ',
  FIRST_SEAT:   '১ম আসন',
  F_SEAT:       '১ম আসন',
  AC_S_CHAIR:   'AC চেয়ার',
  AC_CHAIR:     'AC চেয়ার',
  SHOVAN:       'শোভন',
  SHULOV:       'সুলভ',
}

export default function TrainResultCard({ train, railShebaUrl, fromStation, toStation }: Props) {
  const typeLabel = formatTrainType(train.train_type)

  return (
    <article className="bg-bg-elevated border border-border-subtle rounded-xl p-5 sm:p-6 hover:border-primary/20 transition-colors">

      {/* Train name + type */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Train size={14} className="text-primary flex-shrink-0" />
            <span className="text-text-tertiary font-mono text-xs">{train.train_number}</span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold font-inter rounded-sm">
              {typeLabel}
            </span>
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

      {/* Times + duration */}
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

      {/* Last verified */}
      {train.last_verified && (
        <p className="mt-3 text-text-tertiary text-xs font-inter">
          Schedule last verified: {train.last_verified}
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
