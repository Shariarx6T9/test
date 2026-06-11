import SectionHeader from '@/components/ui/SectionHeader'

const COPY = {
  overline:    'WHO IT\'S FOR',
  headline:    'Every kind of Bangladesh train traveler.',
  subheadline: "Whether you commute daily or travel once a year, RailMate gives you exactly what you need.",
}

const PERSONAS = [
  {
    emoji: '🧑‍💼',
    role:  'The Daily Commuter',
    route: 'Narayanganj ↔ Dhaka',
    needs: [
      'Instant delay alerts before leaving home',
      'One-tap saved route to their platform',
      'Crowding reports for their regular train',
    ],
    quote: '"I used to leave 30 minutes early just in case. Now I check RailMate and leave at the right time."',
    tag:   'Most uses: Alerts + Saved Routes',
  },
  {
    emoji: '🧳',
    role:  'The Long-Distance Traveler',
    route: 'Dhaka → Cox\'s Bazar',
    needs: [
      'Full timetable with all stoppage times',
      'Fare comparison across coach classes',
      'Community reports for overnight journeys',
    ],
    quote: '"Knowing the AC Berth vs Snigdha price difference before I book saves me from overpaying every time."',
    tag:   'Most uses: Schedules + Fare Calc',
  },
  {
    emoji: '🏡',
    role:  'Traveling Home for Eid',
    route: 'Dhaka → Sylhet / Chittagong / Rajshahi',
    needs: [
      'Seat availability intel from other travelers',
      'Alternate route suggestions when trains are full',
      'Works without data at crowded stations',
    ],
    quote: '"During Eid the stations are chaos. Offline mode is the only thing that works in that crowd."',
    tag:   'Most uses: Offline + Community',
  },
]

export default function UserBenefits() {
  return (
    <section className="bg-[#0F1929] py-20" id="benefits">
      <div className="max-w-[1200px] mx-auto px-6">

        <SectionHeader overline={COPY.overline} headline={COPY.headline} subheadline={COPY.subheadline} />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {PERSONAS.map((p) => (
            <div
              key={p.role}
              className="feature-card bg-[#162035] border border-[#1E2E42] rounded-2xl p-6 flex flex-col"
            >
              {/* Avatar + role */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#1A2840', fontSize: '22px' }}
                >
                  {p.emoji}
                </div>
                <div>
                  <p
                    className="text-[#F0F4FF] font-bold"
                    style={{ fontSize: '15px', fontFamily: 'var(--font-jakarta)' }}
                  >
                    {p.role}
                  </p>
                  <p
                    className="text-[#00A859]"
                    style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 500 }}
                  >
                    {p.route}
                  </p>
                </div>
              </div>

              {/* Needs */}
              <ul className="flex flex-col gap-2 mb-5">
                {p.needs.map((n) => (
                  <li
                    key={n}
                    className="flex items-start gap-2 text-[#8FA3C0]"
                    style={{ fontSize: '13px', fontFamily: 'var(--font-inter)', lineHeight: '1.5' }}
                  >
                    <span className="text-[#00A859] mt-0.5 flex-shrink-0">✓</span>
                    {n}
                  </li>
                ))}
              </ul>

              {/* Quote */}
              <blockquote
                className="text-[#8FA3C0] italic border-l-2 border-[#2A3F57] pl-3 mb-4 mt-auto"
                style={{ fontSize: '13px', fontFamily: 'var(--font-inter)', lineHeight: '1.6' }}
              >
                {p.quote}
              </blockquote>

              {/* Tag */}
              <div
                className="inline-flex items-center px-2.5 py-1 rounded-md self-start"
                style={{ background: 'rgba(0,168,89,0.10)', color: '#00A859', fontSize: '11px', fontFamily: 'var(--font-inter)', fontWeight: 600 }}
              >
                {p.tag}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
