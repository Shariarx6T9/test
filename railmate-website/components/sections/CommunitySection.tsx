import SectionHeader from '@/components/ui/SectionHeader'

const COPY = {
  overline:   'COMMUNITY INTELLIGENCE',
  headline:   'Real Reports. Real Travelers.',
  body1:
    "No government API. No paid data feed. Just thousands of Bangladeshi train passengers telling each other what's actually happening right now.",
  body2:
    'When Subarna Express leaves Comilla 20 minutes late, someone on that train reports it. Within seconds, everyone waiting at Chittagong knows.',
  stat1n: '8 travelers',
  stat1l: 'confirmed a delay this morning',
  stat2n: '< 3 min',
  stat2l: 'average time from event to report',
  stat3n: 'Free forever',
  stat3l: 'community features cost nothing',
}

const REPORTS = [
  {
    badge:   '⚠️  DELAY',
    bColor:  '#E8394B',
    bBg:     'rgba(232,57,75,0.10)',
    lBorder: '#E8394B',
    train:   'Subarna Express #721',
    detail:  'Delayed 20 min at Comilla · Reported 3 min ago',
    confirm: '✓ 12 travelers confirmed this',
    cColor:  '#00C977',
    fade:    'report-fade-1',
  },
  {
    badge:   '🟡 CROWDING',
    bColor:  '#F5A623',
    bBg:     'rgba(245,166,35,0.10)',
    lBorder: '#F5A623',
    train:   'Turna Express · Dhaka-bound',
    detail:  'Very High · Coach 3–5 overcrowded',
    confirm: '✓ 8 confirmed',
    cColor:  '#00C977',
    fade:    'report-fade-2',
  },
  {
    badge:   '✅  ON TIME',
    bColor:  '#00C977',
    bBg:     'rgba(0,201,119,0.10)',
    lBorder: '#00C977',
    train:   'Sonar Bangla Express #787',
    detail:  'Running on schedule · 25 confirmations',
    confirm: '✓ 25 confirmed',
    cColor:  '#00C977',
    fade:    'report-fade-3',
  },
]

export default function CommunitySection() {
  return (
    <section className="bg-[#0F1929] py-20" id="community">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* Left */}
          <div className="flex-1" style={{ maxWidth: '540px' }}>
            <SectionHeader
              overline={COPY.overline}
              headline={COPY.headline}
              align="left"
              maxWidth="100%"
            />

            <p
              className="mt-5 text-[#8FA3C0]"
              style={{ fontSize: '16px', fontFamily: 'var(--font-inter)', lineHeight: '1.65' }}
            >
              {COPY.body1}
            </p>
            <p
              className="mt-4 text-[#8FA3C0]"
              style={{ fontSize: '16px', fontFamily: 'var(--font-inter)', lineHeight: '1.65' }}
            >
              {COPY.body2}
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-col gap-5">
              {[
                { n: COPY.stat1n, l: COPY.stat1l },
                { n: COPY.stat2n, l: COPY.stat2l },
                { n: COPY.stat3n, l: COPY.stat3l },
              ].map((s) => (
                <div key={s.n}>
                  <span
                    className="block text-[#00A859] font-extrabold"
                    style={{ fontSize: '32px', fontFamily: 'var(--font-jakarta)', lineHeight: '1.1' }}
                  >
                    {s.n}
                  </span>
                  <span
                    className="block text-[#8FA3C0] mt-1"
                    style={{ fontSize: '14px', fontFamily: 'var(--font-inter)' }}
                  >
                    {s.l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — feed */}
          <div className="w-full lg:w-auto lg:flex-shrink-0" style={{ maxWidth: '340px' }}>
            <div className="flex flex-col gap-3">
              {REPORTS.map((r) => (
                <div
                  key={r.train}
                  className={`bg-[#162035] border border-[#1E2E42] rounded-2xl overflow-hidden ${r.fade}`}
                  style={{ borderLeft: `3px solid ${r.lBorder}` }}
                >
                  <div className="p-4">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold mb-2"
                      style={{ background: r.bBg, color: r.bColor, fontFamily: 'var(--font-inter)' }}
                    >
                      {r.badge}
                    </span>
                    <p
                      className="text-[#F0F4FF] font-semibold"
                      style={{ fontSize: '14px', fontFamily: 'var(--font-inter)' }}
                    >
                      {r.train}
                    </p>
                    <p
                      className="text-[#8FA3C0] mt-1"
                      style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}
                    >
                      {r.detail}
                    </p>
                    <p
                      className="mt-1.5"
                      style={{ fontSize: '12px', color: r.cColor, fontFamily: 'var(--font-inter)' }}
                    >
                      {r.confirm}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
