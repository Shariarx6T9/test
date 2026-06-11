const TRANSLATIONS = {
  headline:    'Sound familiar?',
  subheadline: 'Every Bangladesh train traveler knows these problems.',
  transition:  'RailMate fixes all three. For free.',
}

const PAIN_POINTS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 5L28 27H4L16 5z" stroke="#E8394B" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M16 13v6M16 22.5v.5" stroke="#E8394B" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title:      'Is my train even on time?',
    body:       'You leave home, reach the station, and only then find out your train is delayed 45 minutes. No app warned you. No one knew.',
    bgColor:    'rgba(232,57,75,0.06)',
    borderColor:'rgba(232,57,75,0.2)',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="10" height="10" rx="2" stroke="#F5A623" strokeWidth="2"/>
        <rect x="18" y="4" width="10" height="10" rx="2" stroke="#F5A623" strokeWidth="2"/>
        <rect x="4" y="18" width="10" height="10" rx="2" stroke="#F5A623" strokeWidth="2"/>
        <rect x="18" y="18" width="10" height="10" rx="2" stroke="#F5A623" strokeWidth="2"/>
      </svg>
    ),
    title:      '3 apps for 1 journey',
    body:       'BR website for schedules. Shohoz for tickets. WhatsApp groups for delay news. There\'s no single place that does everything.',
    bgColor:    'rgba(245,166,35,0.06)',
    borderColor:'rgba(245,166,35,0.2)',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="11" stroke="#4EA8E0" strokeWidth="2"/>
        <text x="16" y="21" textAnchor="middle" fill="#4EA8E0" fontSize="14" fontWeight="700">৳</text>
      </svg>
    ),
    title:      'What does this ticket actually cost?',
    body:       'Fare tables are buried in PDFs. Prices differ by class, season, and nobody tells you that Snigdha isn\'t available on this route.',
    bgColor:    'rgba(78,168,224,0.06)',
    borderColor:'rgba(78,168,224,0.2)',
  },
]

export default function ProblemSection() {
  return (
    <section className="bg-[#0F1929] py-20" id="problem">
      <div className="container-inner">

        {/* Headlines */}
        <div className="text-center max-w-[680px] mx-auto">
          <h2
            className="text-[#F0F4FF] font-extrabold"
            style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontFamily: 'var(--font-jakarta)', lineHeight: '1.2' }}
          >
            {TRANSLATIONS.headline}
          </h2>
          <p
            className="mt-3 text-[#8FA3C0]"
            style={{ fontSize: '17px', fontFamily: 'var(--font-inter)', lineHeight: '1.6' }}
          >
            {TRANSLATIONS.subheadline}
          </p>
        </div>

        {/* Pain Point Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {PAIN_POINTS.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl p-6 border"
              style={{
                background: point.bgColor,
                borderColor: point.borderColor,
              }}
            >
              <div className="mb-4">{point.icon}</div>
              <h3
                className="text-[#F0F4FF] font-bold mb-3"
                style={{ fontSize: '18px', fontFamily: 'var(--font-jakarta)', lineHeight: '1.3' }}
              >
                {point.title}
              </h3>
              <p
                className="text-[#8FA3C0]"
                style={{ fontSize: '15px', fontFamily: 'var(--font-inter)', lineHeight: '1.65' }}
              >
                {point.body}
              </p>
            </div>
          ))}
        </div>

        {/* Transition Line */}
        <p
          className="text-center mt-10 font-bold text-[#00A859]"
          style={{ fontSize: '20px', fontFamily: 'var(--font-jakarta)' }}
        >
          {TRANSLATIONS.transition}
        </p>

      </div>
    </section>
  )
}
