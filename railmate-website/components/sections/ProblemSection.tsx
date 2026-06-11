import SectionHeader from '@/components/ui/SectionHeader'

const COPY = {
  headline:    'Sound familiar?',
  subheadline: 'Every Bangladesh train traveler knows these problems.',
  transition:  'RailMate fixes all three. For free.',
}

const PAIN_POINTS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M16 5L28 27H4L16 5z" stroke="#E8394B" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M16 13v6M16 22.5v.5" stroke="#E8394B" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title:       'Is my train even on time?',
    body:        'You leave home, reach the station, and only then find out your train is delayed 45 minutes. No app warned you. No one knew.',
    bg:          'rgba(232,57,75,0.06)',
    border:      'rgba(232,57,75,0.2)',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect x="4"  y="4"  width="10" height="10" rx="2" stroke="#F5A623" strokeWidth="2"/>
        <rect x="18" y="4"  width="10" height="10" rx="2" stroke="#F5A623" strokeWidth="2"/>
        <rect x="4"  y="18" width="10" height="10" rx="2" stroke="#F5A623" strokeWidth="2"/>
        <rect x="18" y="18" width="10" height="10" rx="2" stroke="#F5A623" strokeWidth="2"/>
      </svg>
    ),
    title:       '3 apps for 1 journey',
    body:        "BR website for schedules. Shohoz for tickets. WhatsApp groups for delay news. There's no single place that does everything.",
    bg:          'rgba(245,166,35,0.06)',
    border:      'rgba(245,166,35,0.2)',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <circle cx="16" cy="16" r="11" stroke="#4EA8E0" strokeWidth="2"/>
        <text x="16" y="22" textAnchor="middle" fill="#4EA8E0" fontSize="15" fontWeight="700" fontFamily="serif">৳</text>
      </svg>
    ),
    title:       'What does this ticket actually cost?',
    body:        "Fare tables are buried in PDFs. Prices differ by class, season, and nobody tells you that Snigdha isn't available on this route.",
    bg:          'rgba(78,168,224,0.06)',
    border:      'rgba(78,168,224,0.2)',
  },
]

export default function ProblemSection() {
  return (
    <section className="bg-[#0F1929] py-20" id="problem">
      <div className="max-w-[1200px] mx-auto px-6">

        <SectionHeader headline={COPY.headline} subheadline={COPY.subheadline} />

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {PAIN_POINTS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl p-6 border"
              style={{ background: p.bg, borderColor: p.border }}
            >
              <div className="mb-4">{p.icon}</div>
              <h3
                className="text-[#F0F4FF] font-bold mb-3"
                style={{ fontSize: '18px', fontFamily: 'var(--font-jakarta)', lineHeight: '1.3' }}
              >
                {p.title}
              </h3>
              <p
                className="text-[#8FA3C0]"
                style={{ fontSize: '15px', fontFamily: 'var(--font-inter)', lineHeight: '1.65' }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {/* Transition line */}
        <p
          className="text-center mt-10 font-bold text-[#00A859]"
          style={{ fontSize: '20px', fontFamily: 'var(--font-jakarta)' }}
        >
          {COPY.transition}
        </p>
      </div>
    </section>
  )
}
