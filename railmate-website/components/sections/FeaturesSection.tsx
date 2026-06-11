const TRANSLATIONS = {
  overline:   'WHAT RAILMATE DOES',
  headline:   'Everything for your journey. Nothing you don\'t need.',
}

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="13" rx="2" stroke="#00A859" strokeWidth="1.5"/>
        <path d="M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" stroke="#00A859" strokeWidth="1.5"/>
        <path d="M8 14.5h8M6 11.5h2M16 11.5h2" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="8" cy="17" r="1" fill="#00A859"/>
        <circle cx="16" cy="17" r="1" fill="#00A859"/>
      </svg>
    ),
    title:  'Train Schedules',
    body:   'Full timetables for all Bangladesh Railway intercity routes. Updated when BR updates. Always with last-verified date shown.',
    tag:    'FREE',
    tagType:'free',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#00A859" strokeWidth="1.5"/>
        <text x="12" y="17" textAnchor="middle" fill="#00A859" fontSize="12" fontWeight="700">৳</text>
      </svg>
    ),
    title:  'Fare Calculator',
    body:   'Exact fares for all 8 coach classes — Shovon to AC Berth. Pick your route, pick your class. No more PDF digging.',
    tag:    'FREE',
    tagType:'free',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" stroke="#F5A623" strokeWidth="1.5"/>
        <circle cx="15" cy="8" r="3" stroke="#F5A623" strokeWidth="1.5"/>
        <path d="M3 20c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title:  'Live Delay Reports',
    body:   'Fellow travelers report delays, crowding, and coach conditions in real time. Know what\'s happening before you leave home.',
    tag:    'FREE',
    tagType:'free',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C9.24 3 7 5.24 7 8c0 3.75 5 10 5 10s5-6.25 5-10c0-2.76-2.24-5-5-5z" stroke="#00A859" strokeWidth="1.5"/>
        <circle cx="12" cy="8" r="1.5" fill="#00A859"/>
        <path d="M5 21h14" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title:  'Departure Alerts',
    body:   'Get a push notification before your train departs. Never miss your Dhaka–Chittagong express again.',
    tag:    'PRO',
    tagType:'pro',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="2" y1="2" x2="22" y2="22" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title:  'Offline Access',
    body:   'Full schedule data cached on your device. Works in stations with no signal. Works on overnight journeys with no data.',
    tag:    'PRO',
    tagType:'pro',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#00A859" strokeWidth="1.5"/>
        <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 3c0 0-2 3-2 9s2 9 2 9M3 12h18" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title:  'Bengali & English',
    body:   'Station names, train names, all UI in both languages. Switch any time. Noto Sans Bengali for proper rendering.',
    tag:    'FREE',
    tagType:'free',
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-[#080D17] py-20" id="features">
      <div className="container-inner">

        {/* Section Header */}
        <div className="max-w-[680px] mx-auto text-center mb-12">
          <p
            className="text-[#00A859] uppercase mb-3"
            style={{ fontSize: '11px', fontFamily: 'var(--font-inter)', fontWeight: 600, letterSpacing: '0.08em' }}
          >
            {TRANSLATIONS.overline}
          </p>
          <h2
            className="text-[#F0F4FF] font-extrabold"
            style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontFamily: 'var(--font-jakarta)', lineHeight: '1.2' }}
          >
            {TRANSLATIONS.headline}
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1100px] mx-auto">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="feature-card bg-[#162035] border border-[#1E2E42] rounded-2xl p-6 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex-shrink-0">{feat.icon}</div>
                <span
                  className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
                  style={
                    feat.tagType === 'free'
                      ? { background: 'rgba(0,168,89,0.10)', color: '#00A859', fontFamily: 'var(--font-inter)' }
                      : { background: 'rgba(245,166,35,0.12)', color: '#F5A623', fontFamily: 'var(--font-inter)' }
                  }
                >
                  {feat.tag}
                </span>
              </div>
              <h3
                className="text-[#F0F4FF] font-bold mb-2"
                style={{ fontSize: '16px', fontFamily: 'var(--font-jakarta)' }}
              >
                {feat.title}
              </h3>
              <p
                className="text-[#8FA3C0]"
                style={{ fontSize: '14px', fontFamily: 'var(--font-inter)', lineHeight: '1.65' }}
              >
                {feat.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
