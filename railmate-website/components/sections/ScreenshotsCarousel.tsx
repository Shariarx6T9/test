'use client'

import { useState, useEffect, useCallback } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'

const COPY = {
  overline:    'APP PREVIEW',
  headline:    'See it before you download it.',
  subheadline: 'A quick look at every screen you\'ll use.',
}

/* ─── Individual screen mock data ──────────────────────────── */
const SCREENS = [
  {
    id:    'search',
    label: 'Train Search',
    bg:    '#0F1929',
    content: (
      <div className="flex flex-col h-full p-4 gap-3">
        {/* Top bar */}
        <div className="rounded-lg bg-[#162035] border border-[#1E2E42] p-3">
          <p style={{ fontSize: '11px', color: '#4E6480', fontFamily: 'var(--font-inter)' }}>FROM</p>
          <p style={{ fontSize: '15px', color: '#F0F4FF', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>Dhaka</p>
        </div>
        <div className="self-center w-8 h-8 rounded-full bg-[#00A859] flex items-center justify-center text-[#080D17] font-bold text-lg">⇅</div>
        <div className="rounded-lg bg-[#162035] border border-[#1E2E42] p-3">
          <p style={{ fontSize: '11px', color: '#4E6480', fontFamily: 'var(--font-inter)' }}>TO</p>
          <p style={{ fontSize: '15px', color: '#F0F4FF', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>Chittagong</p>
        </div>
        <div className="rounded-lg bg-[#162035] border border-[#1E2E42] p-3 flex justify-between items-center">
          <div>
            <p style={{ fontSize: '11px', color: '#4E6480', fontFamily: 'var(--font-inter)' }}>DATE</p>
            <p style={{ fontSize: '13px', color: '#F0F4FF', fontFamily: 'var(--font-inter)' }}>Thu, 11 Jun</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#4E6480', fontFamily: 'var(--font-inter)' }}>CLASS</p>
            <p style={{ fontSize: '13px', color: '#F0F4FF', fontFamily: 'var(--font-inter)' }}>All</p>
          </div>
        </div>
        <div className="mt-auto rounded-lg bg-[#00A859] p-3 text-center">
          <p style={{ fontSize: '14px', color: '#080D17', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>Search Trains</p>
        </div>
      </div>
    ),
  },
  {
    id:    'results',
    label: 'Search Results',
    bg:    '#080D17',
    content: (
      <div className="flex flex-col h-full p-3 gap-2.5">
        <div className="flex items-center gap-2 pb-2 border-b border-[#1E2E42]">
          <span style={{ color: '#8FA3C0', fontSize: '13px' }}>←</span>
          <p style={{ fontSize: '13px', color: '#F0F4FF', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>Dhaka → Chittagong</p>
        </div>
        {[
          { name: 'Subarna Express', time: '06:40 → 11:15', delay: '⚠ 15 min late', dc: '#F5A623', db: 'rgba(245,166,35,0.1)' },
          { name: 'Sonar Bangla',    time: '07:00 → 12:00', delay: '✓ On time',     dc: '#00C977', db: 'rgba(0,201,119,0.1)' },
          { name: 'Turna Exp.',      time: '08:00 → 13:20', delay: '✓ On time',     dc: '#00C977', db: 'rgba(0,201,119,0.1)' },
        ].map((t) => (
          <div key={t.name} className="rounded-lg bg-[#162035] border border-[#1E2E42] p-3" style={{ borderLeft: '3px solid #00A859' }}>
            <p style={{ fontSize: '12px', color: '#F0F4FF', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>{t.name}</p>
            <p style={{ fontSize: '11px', color: '#8FA3C0', fontFamily: 'monospace', marginTop: '2px' }}>{t.time}</p>
            <span style={{ fontSize: '10px', background: t.db, color: t.dc, padding: '1px 6px', borderRadius: '9999px', display: 'inline-block', marginTop: '4px', fontFamily: 'var(--font-inter)' }}>{t.delay}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id:    'fare',
    label: 'Fare Calculator',
    bg:    '#0F1929',
    content: (
      <div className="flex flex-col h-full p-4 gap-3">
        <p style={{ fontSize: '14px', color: '#F0F4FF', fontFamily: 'var(--font-jakarta)', fontWeight: 700 }}>Fare Calculator</p>
        <p style={{ fontSize: '11px', color: '#8FA3C0', fontFamily: 'var(--font-inter)' }}>Dhaka → Chittagong</p>
        <div className="h-px bg-[#1E2E42]"/>
        {[
          { cls: 'Shovon Chair', fare: '৳285' },
          { cls: 'Shovon',       fare: '৳175' },
          { cls: 'Snigdha',      fare: '৳534' },
          { cls: 'AC Chair',     fare: '৳641' },
          { cls: 'AC Berth',     fare: '৳962' },
        ].map((r) => (
          <div key={r.cls} className="flex justify-between items-center py-1.5 border-b border-[#1E2E42] last:border-0">
            <p style={{ fontSize: '12px', color: '#8FA3C0', fontFamily: 'var(--font-inter)' }}>{r.cls}</p>
            <p style={{ fontSize: '13px', color: '#00A859', fontFamily: 'var(--font-jakarta)', fontWeight: 700 }}>{r.fare}</p>
          </div>
        ))}
        <p style={{ fontSize: '10px', color: '#4E6480', fontFamily: 'var(--font-inter)', marginTop: 'auto' }}>Prices as of Jun 2025</p>
      </div>
    ),
  },
  {
    id:    'alerts',
    label: 'Departure Alerts',
    bg:    '#080D17',
    content: (
      <div className="flex flex-col h-full p-4 gap-3">
        <p style={{ fontSize: '14px', color: '#F0F4FF', fontFamily: 'var(--font-jakarta)', fontWeight: 700 }}>My Alerts</p>
        <div className="rounded-lg bg-[#162035] border border-[#1E2E42] p-3">
          <div className="flex justify-between items-start">
            <p style={{ fontSize: '12px', color: '#F0F4FF', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>Subarna Express</p>
            <span style={{ fontSize: '10px', background: 'rgba(0,168,89,0.1)', color: '#00A859', padding: '1px 6px', borderRadius: '9999px', fontFamily: 'var(--font-inter)' }}>ACTIVE</span>
          </div>
          <p style={{ fontSize: '11px', color: '#8FA3C0', fontFamily: 'var(--font-inter)', marginTop: '4px' }}>Alert: 45 min before · Every Mon–Fri</p>
        </div>
        <div className="rounded-2xl bg-[#0F1929] border border-[#1E2E42] p-4 mt-2">
          <p style={{ fontSize: '11px', color: '#4E6480', fontFamily: 'var(--font-inter)', textAlign: 'center' }}>⚡ PRO feature</p>
          <p style={{ fontSize: '12px', color: '#F5A623', fontFamily: 'var(--font-inter)', textAlign: 'center', marginTop: '4px' }}>Upgrade for unlimited alerts</p>
        </div>
      </div>
    ),
  },
]

export default function ScreenshotsCarousel() {
  const [active, setActive] = useState(0)

  const next = useCallback(() => setActive((i) => (i + 1) % SCREENS.length), [])
  const prev = useCallback(() => setActive((i) => (i - 1 + SCREENS.length) % SCREENS.length), [])

  /* auto-advance every 4s */
  useEffect(() => {
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [next])

  const screen = SCREENS[active]

  return (
    <section className="bg-[#0F1929] py-20" id="screenshots">
      <div className="max-w-[1200px] mx-auto px-6">

        <SectionHeader overline={COPY.overline} headline={COPY.headline} subheadline={COPY.subheadline} />

        <div className="mt-12 flex flex-col items-center gap-8">

          {/* Phone shell */}
          <div
            style={{
              width: '260px',
              height: '520px',
              borderRadius: '36px',
              border: '2px solid #2A3F57',
              background: screen.bg,
              overflow: 'hidden',
              boxShadow: '0 24px 48px rgba(0,0,0,0.5), 0 0 32px rgba(0,168,89,0.06)',
              transition: 'background 300ms ease',
              position: 'relative',
            }}
          >
            {/* Notch */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '56px', height: '18px', background: '#080D17', borderRadius: '0 0 10px 10px' }} />

            {/* Screen label */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full"
              style={{ background: 'rgba(0,168,89,0.15)', color: '#00A859', fontSize: '10px', fontFamily: 'var(--font-inter)', fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              {screen.label}
            </div>

            <div className="h-full pt-6 pb-10">
              {screen.content}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-[#2A3F57] text-[#8FA3C0] hover:text-[#F0F4FF] hover:border-[#4E6480] transition-colors"
              aria-label="Previous screenshot"
            >
              ←
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {SCREENS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`screenshot-dot ${i === active ? 'active' : ''}`}
                  aria-label={`Go to screenshot ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-[#2A3F57] text-[#8FA3C0] hover:text-[#F0F4FF] hover:border-[#4E6480] transition-colors"
              aria-label="Next screenshot"
            >
              →
            </button>
          </div>

          {/* Screen labels row */}
          <div className="flex flex-wrap justify-center gap-2">
            {SCREENS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className="px-3 py-1 rounded-full text-[12px] font-medium transition-colors duration-150"
                style={
                  i === active
                    ? { background: 'rgba(0,168,89,0.12)', color: '#00A859', border: '1px solid rgba(0,168,89,0.3)', fontFamily: 'var(--font-inter)' }
                    : { background: 'transparent', color: '#4E6480', border: '1px solid #1E2E42', fontFamily: 'var(--font-inter)' }
                }
              >
                {s.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
