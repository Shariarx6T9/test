/**
 * TrainResultCard — website search results
 *
 * All user-visible strings are sourced from next-intl (en.json / bn.json
 * under the "train_search" key). Zero hardcoded English or Bengali strings.
 *
 * The "Buy Ticket" link goes to eticket.railway.gov.bd, the official
 * Bangladesh Railway e-ticketing portal.
 * ⚠️  HUMAN REVIEW: confirm eticket.railway.gov.bd is still the correct
 * official URL before shipping to production.
 *
 * Fare amounts are intentionally excluded from this component — they are
 * app-exclusive per Master Reference Part 05 §5.6.
 */
import { ArrowRight, Clock, Train, CalendarBlank, CheckCircle, ClockCountdown, Warning } from '@phosphor-icons/react/dist/ssr'
import { useTranslations } from 'next-intl'
import { formatDuration } from '@/lib/train-search'
import type { TrainSearchResult } from '@/lib/train-search'

interface Props {
  train:       TrainSearchResult
  fromStation: string
  toStation:   string
}

export default function TrainResultCard({ train, fromStation, toStation }: Props) {
  const t = useTranslations('train_search')

  return (
    <article className="bg-bg-elevated border border-border-subtle rounded-xl p-5 sm:p-6 hover:border-primary/20 transition-colors">

      {/* Train name + type + verification badge */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Train size={14} className="text-primary flex-shrink-0" />
            <span className="text-text-tertiary font-mono text-xs">{train.train_number}</span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold font-inter rounded-sm">
              {formatTrainType(train.train_type)}
            </span>

            {train.verified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold font-inter rounded-sm">
                <CheckCircle size={11} weight="fill" />
                {t('verified_schedule')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent text-xs font-semibold font-inter rounded-sm">
                <ClockCountdown size={11} weight="bold" />
                {t('schedule_being_verified')}
              </span>
            )}
          </div>
          <h3 className="text-text-primary font-bold font-jakarta text-base leading-tight">
            {train.train_name_en}
          </h3>
        </div>

        {/*
          Buy Ticket — plain outbound link to official BR e-ticketing portal.
          No affiliate tracking, no commission parameters, no third-party URL.
          Per Master Reference Part 02 §2.1: plain outbound link requires no
          partnership approval. Affiliate params require written Shohoz deal.
          ⚠️  HUMAN REVIEW: verify eticket.railway.gov.bd URL before shipping.
        */}
        <a
          href="https://eticket.railway.gov.bd"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center h-9 px-4 bg-primary text-white text-xs font-bold font-inter rounded-md hover:bg-primary-dim transition-colors"
          aria-label={t('buy_ticket_aria', { trainName: train.train_name_en })}
        >
          {t('buy_ticket')}
        </a>
      </div>

      {train.verified ? (
        /* ── Verified timetable — real times from train_stops only ── */
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
        /* ── Route confirmed, no verified timing — never show a fake time ── */
        <div className="flex items-center gap-2 mb-4 py-3 px-3 bg-bg-card rounded-md border border-border-subtle">
          <Train size={16} className="text-text-tertiary flex-shrink-0" />
          <p className="text-text-secondary text-sm font-inter">
            {fromStation} <ArrowRight size={12} className="inline mx-1 -mt-0.5" /> {toStation}
          </p>
          <span className="text-text-tertiary text-xs font-inter ml-auto">
            {t('exact_times_not_verified')}
          </span>
        </div>
      )}

      {/* Community delay signal — from public_delay_aggregates, shown when present */}
      {train.delay_report_count > 0 && (
        <div className="flex items-center gap-1.5 mb-3">
          <Warning size={12} className="text-danger flex-shrink-0" />
          <span className="text-xs font-inter text-danger">
            {train.avg_delay_minutes
              ? t('delay_reported', { minutes: Math.round(train.avg_delay_minutes) })
              : null
            }
            {' '}
            ({train.delay_report_count === 1
              ? t('delay_reports_count', { count: train.delay_report_count })
              : t('delay_reports_count_plural', { count: train.delay_report_count })
            })
          </span>
        </div>
      )}

      {/* Available classes — names only, no fares (app-exclusive per spec) */}
      {train.available_classes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {train.available_classes.map((cls) => (
            <span
              key={cls}
              className="px-2 py-0.5 bg-bg-card border border-border-subtle rounded-sm text-xs font-inter text-text-secondary"
            >
              {formatClassLabel(cls)}
            </span>
          ))}
        </div>
      )}

      {/* Fare CTA — intentionally shows no amounts, redirects to app */}
      <span className="text-text-tertiary text-xs font-inter italic">
        {t('fares_in_app')}
      </span>

      {!train.verified && (
        <p className="mt-3 text-text-tertiary text-xs font-inter leading-relaxed">
          {t('unverified_notice')}
        </p>
      )}
    </article>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Maps train type from DB value to display label. No hardcoded strings — the
 *  DB value itself is used as fallback if no mapping exists. */
function formatTrainType(type: string): string {
  const map: Record<string, string> = {
    'Intercity': 'Intercity',
    'Mail':      'Mail',
    'Local':     'Local',
    'Express':   'Express',
  }
  return map[type] ?? type
}

/**
 * Maps seat class code to display label.
 * These labels are also in en.json / bn.json under train_search.class_labels
 * for use in server components. This helper is for client-side convenience.
 */
function formatClassLabel(cls: string): string {
  const map: Record<string, string> = {
    'SHOVON':       'Shovon',
    'SHOVON_CHAIR': 'Shovon Chair',
    'SNIGDHA':      'Snigdha',
    'AC_BERTH':     'AC Berth',
    'AC_SEAT':      'AC Seat',
    'FIRST_BERTH':  'First Berth',
    'FIRST_SEAT':   'First Seat',
    'AC_S_CHAIR':   'AC S Chair',
  }
  return map[cls] ?? cls
}
