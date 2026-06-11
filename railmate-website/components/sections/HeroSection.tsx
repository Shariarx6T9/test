import DownloadButton from '@/components/ui/DownloadButton'

const COPY = {
  overline:  "🇧🇩  Bangladesh's #1 Railway Companion App",
  headline1: 'Your Railway,',
  headline2: 'Simplified',
  period:    '.',
  bengali:   'আপনার রেলযাত্রা, সহজ করা হলো।',
  body:
    'Stop using 3 different apps just to catch one train. RailMate gives you real schedules, real fares, and live delay reports from fellow travelers — all in one place. Free.',
  badge1: 'Free Forever',
  badge2: 'Bengali + English',
  badge3: 'Works Offline',
  phoneHeader: '← Dhaka → Chittagong',
  phoneSub:    'Thu 11 Jun · All Classes',
  train1:      'Subarna Express #721',
  train1Time:  '06:40  ────  11:15  (4h 35m)',
  train1Delay: '⚠ 15 min delay reported',
  train2:      'Sonar Bangla Exp #787',
  train2Time:  '07:00  ────  12:00  (5h 00m)',
  train2Ok:    '✓ On time',
  liveReport:  '🔴 8 travelers confirm delay on Subarna Express',
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="6.25" stroke="#00C977" strokeWidth="1.4"/>
      <path d="M4.5 7l2 2 3-3" stroke="#00C977" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function HeroSection() {
  return (
    <section className="hero-bg min-h-screen flex items-center pt-16" id="hero">
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 py-16 lg:py-24">

          {/* ── LEFT ── */}
          <div className="flex-1" style={{ maxWidth: '600px' }}>

            {/* Overline pill */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-6"
              style={{
                background: 'rgba(0,168,89,0.10)',
                color: '#00A859',
                fontSize: '12px',
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {COPY.overline}
            </div>

            {/* Headline */}
            <h1
              className="text-[#F0F4FF] font-extrabold leading-[1.1]"
              style={{ fontSize: 'clamp(32px, 5.5vw, 56px)', fontFamily: 'var(--font-jakarta)' }}
            >
              {COPY.headline1}
              <br />
              {COPY.headline2}
              <span style={{ color: '#00A859' }}>{COPY.period}</span>
            </h1>

            {/* Bengali */}
            <p
              className="mt-2 text-[#8FA3C0]"
              style={{ fontSize: '18px', lineHeight: '1.7', fontFamily: 'var(--font-bengali)' }}
            >
              {COPY.bengali}
            </p>

            {/* Body */}
            <p
              className="mt-4 text-[#8FA3C0]"
              style={{ fontSize: '17px', lineHeight: '1.65', maxWidth: '520px', fontFamily: 'var(--font-inter)' }}
            >
              {COPY.body}
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mt-5">
              {[COPY.badge1, COPY.badge2, COPY.badge3].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#2A3F57] text-[#8FA3C0]"
                  style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 500 }}
                >
                  <CheckIcon />
                  {badge}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <DownloadButton showNote align="left" />
            </div>
          </div>

          {/* ── RIGHT — Phone mockup ── */}
          <div className="hidden lg:block flex-shrink-0">
            <PhoneMockup />
          </div>

        </div>
      </div>
    </section>
  )
}

function PhoneMockup() {
  return (
    <div
      style={{
        width: '280px',
        height: '560px',
        borderRadius: '36px',
        border: '2px solid #2A3F57',
        background: '#0F1929',
        padding: '20px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 40px rgba(0,168,89,0.08)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '64px', height: '20px', background: '#080D17', borderRadius: '0 0 12px 12px',
        }}
      />

      {/* Header */}
      <div className="mt-6 mb-3">
        <p className="text-[#F0F4FF] font-semibold" style={{ fontSize: '14px', fontFamily: 'var(--font-inter)' }}>
          {COPY.phoneHeader}
        </p>
        <p className="text-[#8FA3C0] mt-0.5" style={{ fontSize: '12px', fontFamily: 'var(--font-inter)' }}>
          {COPY.phoneSub}
        </p>
        <div className="mt-2 h-px bg-[#1E2E42]" />
      </div>

      {/* Train Card 1 */}
      <div
        className="mt-3 rounded-lg bg-[#162035] border border-[#1E2E42] overflow-hidden"
        style={{ borderLeft: '3px solid #00A859' }}
      >
        <div className="p-3">
          <p className="text-[#F0F4FF] font-semibold" style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
            {COPY.train1}
          </p>
          <p className="text-[#F0F4FF] mt-1" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            {COPY.train1Time}
          </p>
          <span
            className="inline-block mt-1.5 px-2 py-0.5 rounded-full"
            style={{ fontSize: '10px', background: 'rgba(245,166,35,0.12)', color: '#F5A623', fontFamily: 'var(--font-inter)' }}
          >
            {COPY.train1Delay}
          </span>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {['S_CHAIR', 'SNIGDHA', 'AC_BERTH'].map((cls) => (
              <span
                key={cls}
                className="px-1.5 py-0.5 rounded text-[#00A859]"
                style={{ fontSize: '9px', background: 'rgba(0,168,89,0.10)', fontFamily: 'var(--font-inter)', fontWeight: 600 }}
              >
                {cls}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Train Card 2 */}
      <div
        className="mt-2.5 rounded-lg bg-[#162035] border border-[#1E2E42] overflow-hidden"
        style={{ borderLeft: '3px solid #00A859' }}
      >
        <div className="p-3">
          <p className="text-[#F0F4FF] font-semibold" style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
            {COPY.train2}
          </p>
          <p className="text-[#F0F4FF] mt-1" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            {COPY.train2Time}
          </p>
          <span
            className="inline-block mt-1.5 px-2 py-0.5 rounded-full"
            style={{ fontSize: '10px', background: 'rgba(0,201,119,0.10)', color: '#00C977', fontFamily: 'var(--font-inter)' }}
          >
            {COPY.train2Ok}
          </span>
        </div>
      </div>

      {/* Live report — floats */}
      <div
        className="mt-3 rounded-lg p-3 animate-float"
        style={{ background: '#1A2840' }}
      >
        <p className="text-[#8FA3C0]" style={{ fontSize: '11px', fontFamily: 'var(--font-inter)', lineHeight: '1.5' }}>
          {COPY.liveReport}
        </p>
      </div>
    </div>
  )
}
