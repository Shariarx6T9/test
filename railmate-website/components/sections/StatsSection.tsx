const STATS = [
  { num: '100+',   label: 'Train Routes Covered' },
  { num: '500+',   label: 'Stations Searchable' },
  { num: '8',      label: 'Coach Classes Supported' },
  { num: 'Free',   label: 'Core Features, Always' },
]

const TRANSLATIONS = {
  notice: 'Schedule data is sourced from Bangladesh Railway official publications (railway.gov.bd) and community-verified. Always confirm critical journeys with official sources. Live delay data is community-reported.',
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="7.75" stroke="#F5A623" strokeWidth="1.5"/>
      <path d="M9 8v5" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="5.5" r="0.75" fill="#F5A623"/>
    </svg>
  )
}

export default function StatsSection() {
  return (
    <section className="bg-[#080D17] py-16" id="stats">
      <div className="container-inner">

        {/* Stat Blocks */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#1E2E42]">
          {STATS.map((s) => (
            <div key={s.num} className="flex flex-col items-center text-center px-8 py-6 sm:py-2">
              <span
                className="text-[#00A859] font-extrabold"
                style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontFamily: 'var(--font-jakarta)', lineHeight: '1' }}
              >
                {s.num}
              </span>
              <span
                className="text-[#8FA3C0] mt-1"
                style={{ fontSize: '14px', fontFamily: 'var(--font-inter)' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Trust Notice */}
        <div
          className="mt-12 flex items-start gap-3 rounded-md p-4 mx-auto"
          style={{
            maxWidth: '720px',
            background: 'rgba(245,166,35,0.08)',
            border: '1px solid rgba(245,166,35,0.25)',
            borderRadius: '10px',
          }}
        >
          <InfoIcon />
          <p
            className="text-[#8FA3C0]"
            style={{ fontSize: '13px', fontFamily: 'var(--font-inter)', lineHeight: '1.6' }}
          >
            {TRANSLATIONS.notice}
          </p>
        </div>

      </div>
    </section>
  )
}
