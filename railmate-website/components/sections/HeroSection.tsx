// components/sections/HeroSection.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import DownloadButton from '@/components/ui/DownloadButton'
import { useI18n } from '@/lib/i18n'
import { useRouter } from '@/lib/i18n/navigation'
import {
  CheckCircle,
  MagnifyingGlass,
  Train,
  CalendarBlank,
  ArrowsLeftRight,
} from '@phosphor-icons/react'
import type { StationOption } from '@/lib/train-search'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  /** Stations list fetched server-side and passed in to avoid a client fetch */
  stations: StationOption[]
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HeroSection({ stations }: Props) {
  const { t } = useI18n()
  const router  = useRouter()
  const badges  = [t.hero.badge1, t.hero.badge2, t.hero.badge3]

  // ── Search state ──────────────────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0]

  const [fromQuery,    setFromQuery]    = useState('')
  const [toQuery,      setToQuery]      = useState('')
  const [date,         setDate]         = useState(today)
  const [fromStation,  setFromStation]  = useState<StationOption | null>(null)
  const [toStation,    setToStation]    = useState<StationOption | null>(null)
  const [fromOpen,     setFromOpen]     = useState(false)
  const [toOpen,       setToOpen]       = useState(false)
  const [formError,    setFormError]    = useState('')

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

  function filterStations(query: string, exclude?: string): StationOption[] {
    const candidates = stations.filter((s) => s.code !== exclude)
    if (!query.trim()) {
      return [...candidates].sort((a, b) => Number(b.is_major) - Number(a.is_major)).slice(0, 8)
    }
    const q = query.toLowerCase()
    return candidates.filter(
      (s) =>
        s.name_en.toLowerCase().includes(q) ||
        s.name_bn?.includes(query) ||
        s.code.toLowerCase().includes(q)
    ).slice(0, 8)
  }

  function swap() {
    setFromStation(toStation)
    setToStation(fromStation)
    setFromQuery(toStation?.name_en ?? '')
    setToQuery(fromStation?.name_en ?? '')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!fromStation) { setFormError('Please select a departure station.'); return }
    if (!toStation)   { setFormError('Please select an arrival station.');   return }
    if (fromStation.code === toStation.code) { setFormError('Stations cannot be the same.'); return }

    const params = new URLSearchParams({
      from: fromStation.code.toLowerCase(),
      to:   toStation.code.toLowerCase(),
      date,
    })
    router.push(`/search?${params.toString()}`)
  }

  const filteredFrom = filterStations(fromQuery, toStation?.code)
  const filteredTo   = filterStations(toQuery,   fromStation?.code)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      className="relative flex items-center pt-20 pb-12 md:pt-24 md:pb-16 lg:min-h-[88vh]"
      id="hero"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
      >
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">

          {/* ── Sibling 1: headline/subtitle/badges (mobile order 1, desktop left column) ── */}
          <div className="order-1 lg:order-1 flex-none w-full lg:w-[44%] text-center lg:text-left space-y-6">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest font-inter">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              {t.hero.overline}
            </div>

            <h1 className="text-text-primary font-extrabold leading-[1.12] text-4xl md:text-5xl lg:text-6xl font-jakarta">
              {t.hero.headline1}
              <br />
              <span className="text-primary">{t.hero.headline2}</span>
            </h1>

            <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-inter">
              {t.hero.subtitle}
            </p>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center lg:justify-start gap-3">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-bg-card border border-border-subtle text-text-secondary text-xs sm:text-sm font-medium font-inter"
                >
                  <CheckCircle size={16} className="text-primary flex-shrink-0" weight="fill" />
                  <span className="truncate">{badge}</span>
                </span>
              ))}
            </div>

            {/* Download CTAs live here in source so desktop gets them naturally
                under the headline column with zero extra CSS. On mobile this div
                is invisible (hidden) — the real mobile CTA renders as Sibling 3
                below, positioned after the search card via order. */}
            <div className="hidden lg:flex pt-1 items-center justify-start gap-3">
              <DownloadButton
                platform="google-play"
                href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || '#'}
                status={!process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL === '#' ? 'coming-soon' : 'available'}
              />
              <DownloadButton
                platform="app-store"
                href={process.env.NEXT_PUBLIC_APP_STORE_URL || '#'}
                status={!process.env.NEXT_PUBLIC_APP_STORE_URL || process.env.NEXT_PUBLIC_APP_STORE_URL === '#' ? 'coming-soon' : 'available'}
              />
            </div>
          </div>

          {/* ── Sibling 2: Search card (mobile order 2, desktop right column) ── */}
          <div className="order-2 lg:order-2 flex-none w-full lg:w-[52%]">
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label={t.hero.search_label}
              style={{
                background:   'rgba(15, 25, 41, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border:       '1px solid rgba(0, 168, 89, 0.18)',
                borderRadius: '24px',
                boxShadow:    '0 0 0 1px rgba(0,168,89,0.06), 0 32px 64px -12px rgba(0,0,0,0.5), 0 0 80px -20px rgba(0,168,89,0.12)',
              }}
              className="p-6 sm:p-8 space-y-5"
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Train size={16} className="text-primary" weight="fill" />
                </div>
                <div>
                  <p className="text-white font-bold font-jakarta text-base leading-tight">
                    {t.hero.search_label}
                  </p>
                  <p className="text-white/40 text-xs font-inter mt-0.5">
                    {stations.length > 0 ? `${stations.length}+ stations` : 'Bangladesh Railway'}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/8" />

              {/* From + Swap + To */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">

                {/* FROM */}
                <div className="flex-1 relative" ref={fromRef}>
                  <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1.5 font-inter">
                    From
                  </label>
                  <div className="relative">
                    <Train
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={fromQuery}
                      onChange={(e) => { setFromQuery(e.target.value); setFromStation(null); setFromOpen(true) }}
                      onFocus={() => setFromOpen(true)}
                      placeholder="Departure station"
                      autoComplete="off"
                      className="w-full h-12 pl-8 pr-3 rounded-xl text-white placeholder-white/30 text-sm font-inter focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                    />
                  </div>
                  {fromOpen && filteredFrom.length > 0 && (
                    <StationDropdown
                      stations={filteredFrom}
                      onSelect={(s) => { setFromStation(s); setFromQuery(s.name_en); setFromOpen(false) }}
                    />
                  )}
                </div>

                {/* SWAP */}
                <button
                  type="button"
                  onClick={swap}
                  aria-label="Swap stations"
                  className="self-center sm:self-end mb-0 sm:mb-0.5 p-2.5 rounded-xl text-white/40 hover:text-primary transition-colors flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <ArrowsLeftRight size={16} />
                </button>

                {/* TO */}
                <div className="flex-1 relative" ref={toRef}>
                  <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1.5 font-inter">
                    To
                  </label>
                  <div className="relative">
                    <Train
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70 pointer-events-none"
                      style={{ transform: 'translateY(-50%) scaleX(-1)' }}
                    />
                    <input
                      type="text"
                      value={toQuery}
                      onChange={(e) => { setToQuery(e.target.value); setToStation(null); setToOpen(true) }}
                      onFocus={() => setToOpen(true)}
                      placeholder="Arrival station"
                      autoComplete="off"
                      className="w-full h-12 pl-8 pr-3 rounded-xl text-white placeholder-white/30 text-sm font-inter focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                    />
                  </div>
                  {toOpen && filteredTo.length > 0 && (
                    <StationDropdown
                      stations={filteredTo}
                      onSelect={(s) => { setToStation(s); setToQuery(s.name_en); setToOpen(false) }}
                    />
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1.5 font-inter">
                  Journey Date
                </label>
                <div className="relative">
                  <CalendarBlank
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70 pointer-events-none"
                  />
                  <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full sm:w-56 h-12 pl-8 pr-3 rounded-xl text-white text-sm font-inter focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', colorScheme: 'dark' }}
                  />
                </div>
              </div>

              {/* Error */}
              {formError && (
                <p className="text-red-400 text-xs font-inter">{formError}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary-dim text-white font-bold font-inter text-sm rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
              >
                <MagnifyingGlass size={16} weight="bold" />
                {t.hero.search_cta}
              </button>

              {/* Subtle footer note */}
              <p className="text-center text-white/25 text-xs font-inter">
                Free · No signup required · 130+ trains
              </p>
            </form>
          </div>

          {/* ── Sibling 3: Download CTAs, mobile only (order 3 = after search card).
                Desktop already has its own copy inside Sibling 1's left column. ── */}
          <div className="order-3 lg:hidden w-full pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <DownloadButton
              platform="google-play"
              href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || '#'}
              status={!process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL === '#' ? 'coming-soon' : 'available'}
              className="w-full sm:w-auto justify-center"
            />
            <DownloadButton
              platform="app-store"
              href={process.env.NEXT_PUBLIC_APP_STORE_URL || '#'}
              status={!process.env.NEXT_PUBLIC_APP_STORE_URL || process.env.NEXT_PUBLIC_APP_STORE_URL === '#' ? 'coming-soon' : 'available'}
              className="w-full sm:w-auto justify-center"
            />
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Station dropdown ─────────────────────────────────────────────────────────

function StationDropdown({
  stations,
  onSelect,
}: {
  stations: StationOption[]
  onSelect: (s: StationOption) => void
}) {
  return (
    <ul
      role="listbox"
      className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 max-h-52 overflow-y-auto shadow-2xl"
      style={{ background: 'rgba(15,25,41,0.98)', border: '1px solid rgba(0,168,89,0.20)' }}
    >
      {stations.map((s) => (
        <li key={s.code} role="option" aria-selected={false}>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onSelect(s) }}
            className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-primary/10 transition-colors group"
          >
            <div>
              <span className="text-white text-sm font-medium font-inter group-hover:text-primary transition-colors">
                {s.name_en}
              </span>
              {s.division && (
                <span className="text-white/35 text-xs font-inter ml-2">{s.division}</span>
              )}
            </div>
            <span className="text-white/25 font-mono text-xs ml-3 flex-shrink-0">{s.code}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
