'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlass, ArrowsLeftRight, Train, CalendarBlank } from '@phosphor-icons/react'
import type { StationOption } from '@/lib/train-search'
import { stationToSlug } from '@/lib/train-search'

interface Props {
  stations: StationOption[]
  defaultFrom?: string // station code
  defaultTo?:   string
  defaultDate?: string // YYYY-MM-DD
}

export default function SearchForm({ stations, defaultFrom, defaultTo, defaultDate }: Props) {
  const router = useRouter()

  const todayISO = new Date().toISOString().split('T')[0]

  const [fromQuery, setFromQuery]   = useState(defaultFrom ? stationName(stations, defaultFrom) : '')
  const [toQuery,   setToQuery]     = useState(defaultTo   ? stationName(stations, defaultTo)   : '')
  const [date,      setDate]        = useState(defaultDate ?? todayISO)
  const [fromStation, setFromStation] = useState<StationOption | null>(
    stations.find((s) => s.code === defaultFrom) ?? null
  )
  const [toStation, setToStation]   = useState<StationOption | null>(
    stations.find((s) => s.code === defaultTo) ?? null
  )
  const [fromOpen,  setFromOpen]    = useState(false)
  const [toOpen,    setToOpen]      = useState(false)
  const [error,     setError]       = useState<string | null>(null)

  const fromRef = useRef<HTMLDivElement>(null)
  const toRef   = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) setFromOpen(false)
      if (toRef.current   && !toRef.current.contains(e.target as Node))   setToOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredFrom = filterStations(stations, fromQuery).filter(
    (s) => s.code !== toStation?.code
  )
  const filteredTo = filterStations(stations, toQuery).filter(
    (s) => s.code !== fromStation?.code
  )

  function swap() {
    setFromStation(toStation)
    setToStation(fromStation)
    setFromQuery(toStation ? toStation.name_en : '')
    setToQuery(fromStation ? fromStation.name_en : '')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!fromStation) { setError('Please select a departure station.'); return }
    if (!toStation)   { setError('Please select an arrival station.');   return }
    if (fromStation.code === toStation.code) { setError('From and To stations cannot be the same.'); return }

    const fromSlug = `${fromStation.code.toLowerCase()}`
    const toSlug   = `${toStation.code.toLowerCase()}`
    router.push(`/train/${fromSlug}-to-${toSlug}?date=${date}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-elevated border border-border-subtle rounded-xl p-6 sm:p-8 space-y-5"
    >
      {/* From / Swap / To row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">

        {/* From station */}
        <div className="relative flex-1 w-full" ref={fromRef}>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1.5 font-inter">
            From
          </label>
          <div className="relative">
            <Train
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
            />
            <input
              type="text"
              value={fromQuery}
              onChange={(e) => {
                setFromQuery(e.target.value)
                setFromStation(null)
                setFromOpen(true)
              }}
              onFocus={() => setFromOpen(true)}
              placeholder="Departure station"
              className="w-full h-12 pl-9 pr-4 bg-bg-base border border-border-subtle rounded-md text-text-primary placeholder-text-tertiary font-inter text-sm focus:outline-none focus:border-primary transition-colors"
              autoComplete="off"
            />
          </div>

          {fromOpen && filteredFrom.length > 0 && (
            <StationDropdown
              stations={filteredFrom}
              onSelect={(s) => {
                setFromStation(s)
                setFromQuery(s.name_en)
                setFromOpen(false)
              }}
            />
          )}
        </div>

        {/* Swap button */}
        <button
          type="button"
          onClick={swap}
          className="self-center sm:self-end mb-0 sm:mb-0.5 p-2.5 rounded-md border border-border-subtle bg-bg-base hover:border-primary hover:text-primary text-text-secondary transition-colors flex-shrink-0"
          aria-label="Swap stations"
        >
          <ArrowsLeftRight size={18} />
        </button>

        {/* To station */}
        <div className="relative flex-1 w-full" ref={toRef}>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1.5 font-inter">
            To
          </label>
          <div className="relative">
            <Train
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
              style={{ transform: 'translateY(-50%) scaleX(-1)' }}
            />
            <input
              type="text"
              value={toQuery}
              onChange={(e) => {
                setToQuery(e.target.value)
                setToStation(null)
                setToOpen(true)
              }}
              onFocus={() => setToOpen(true)}
              placeholder="Arrival station"
              className="w-full h-12 pl-9 pr-4 bg-bg-base border border-border-subtle rounded-md text-text-primary placeholder-text-tertiary font-inter text-sm focus:outline-none focus:border-primary transition-colors"
              autoComplete="off"
            />
          </div>

          {toOpen && filteredTo.length > 0 && (
            <StationDropdown
              stations={filteredTo}
              onSelect={(s) => {
                setToStation(s)
                setToQuery(s.name_en)
                setToOpen(false)
              }}
            />
          )}
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1.5 font-inter">
          Journey Date
        </label>
        <div className="relative">
          <CalendarBlank
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
          />
          <input
            type="date"
            value={date}
            min={todayISO}
            onChange={(e) => setDate(e.target.value)}
            className="w-full sm:w-56 h-12 pl-9 pr-4 bg-bg-base border border-border-subtle rounded-md text-text-primary font-inter text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-danger text-sm font-inter">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full h-12 bg-primary text-white font-bold font-inter rounded-md hover:bg-primary-dim transition-colors flex items-center justify-center gap-2"
      >
        <MagnifyingGlass size={18} weight="bold" />
        Search Trains
      </button>
    </form>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StationDropdown({
  stations,
  onSelect,
}: {
  stations: StationOption[]
  onSelect: (s: StationOption) => void
}) {
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-bg-elevated border border-border-subtle rounded-md shadow-xl z-50 max-h-60 overflow-y-auto">
      {stations.slice(0, 12).map((s) => (
        <button
          key={s.code}
          type="button"
          onClick={() => onSelect(s)}
          className="w-full text-left px-4 py-3 hover:bg-bg-card transition-colors flex items-center justify-between group"
        >
          <div>
            <span className="text-text-primary font-inter text-sm font-medium group-hover:text-primary transition-colors">
              {s.name_en}
            </span>
            {s.division && (
              <span className="text-text-tertiary font-inter text-xs ml-2">{s.division}</span>
            )}
          </div>
          <span className="text-text-tertiary font-mono text-xs ml-3 flex-shrink-0">{s.code}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function stationName(stations: StationOption[], code: string): string {
  return stations.find((s) => s.code === code)?.name_en ?? ''
}

function filterStations(stations: StationOption[], query: string): StationOption[] {
  if (!query.trim()) {
    // Show hubs first when no query
    return [...stations].sort((a, b) => Number(b.is_intercity_hub) - Number(a.is_intercity_hub))
  }
  const q = query.toLowerCase()
  return stations.filter(
    (s) =>
      s.name_en.toLowerCase().includes(q) ||
      s.name_bn.includes(query) ||
      s.code.toLowerCase().includes(q) ||
      s.division?.toLowerCase().includes(q)
  )
}
