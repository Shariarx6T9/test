const TRANSLATIONS = {
  overline:  'COMMUNITY INTELLIGENCE',
  headline:  'Real Reports. Real Travelers.',
  body1:     'No government API. No paid data feed. Just thousands of Bangladeshi train passengers telling each other what\'s actually happening right now.',
  body2:     'When Subarna Express leaves Comilla 20 minutes late, someone on that train reports it. Within seconds, everyone waiting at Chittagong knows.',
  stat1Num:  '8 travelers',
  stat1Lab:  'confirmed a delay this morning',
  stat2Num:  '< 3 min',
  stat2Lab:  'average time from event to report',
  stat3Num:  'Free forever',
  stat3Lab:  'community features cost nothing',
}

const REPORTS = [
  {
    type:      'DELAY',
    typeColor: '#E8394B',
    typeBg:    'rgba(232,57,75,0.10)',
    leftBorder:'#E8394B',
    emoji:     '⚠️',
    train:     'Subarna Express #721',
    detail:    'Delayed 20 min at Comilla · Reported 3 min ago',
    confirm:   '✓ 12 travelers confirmed this',
    confirmColor:'#00C977',
    fadeClass: 'report-fade-1',
  },
  {
    type:      'CROWDING',
    typeColor: '#F5A623',
    typeBg:    'rgba(245,166,35,0.10)',
    leftBorder:'#F5A623',
    emoji:     '🟡',
    train:     'Turna Express · Dhaka-bound',
    detail:    'Very High · Coach 3–5 overcrowded',
    confirm:   '✓ 8 confirmed',
    confirmColor:'#00C977',
    fadeClass: 'report-fade-2',
  },
  {
    type:      'ON TIME',
    typeColor: '#00C977',
    typeBg:    'rgba(0,201,119,0.10)',
    leftBorder:'#00C977',
    emoji:     '✅',
    train:     'Sonar Bangla Express #787',
    detail:    'Running on schedule · 25 confirmations',
    confirm:   '✓ 25 confirmed',
    confirmColor:'#00C977',
    fadeClass: 'report-fade-3',
  },
]

export default function CommunitySection() {
  return (
    <section className="bg-[#0F1929] py-20" id="community">
      <div className="container-inner">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* ── LEFT ── */}
          <div className="flex-1 max-w-[540px]">
            <p
              className="text-[#00A859] uppercase mb-3"
              style={{ fontSize: '11px', fontFamily: 'var(--font-inter)', fontWeight: 600, letterSpacing: '0.08em' }}
            >
              {TRANSLATIONS.overline}
            </p>
            <h2
              className="text-[#F0F4FF] font-extrabold mb-5"
              style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontFamily: 'var(--font-jakarta)', lineHeight: '1.2' }}
            >
              {TRANSLATIONS.headline}
            </h2>
            <p
              className="text-[#8FA3C0] mb-4"
              style={{ fontSize: '16px', fontFamily: 'var(--font-inter)', lineHeight: '1.65' }}
            >
              {TRANSLATIONS.body1}
            </p>
            <p
              className="text-[#8FA3C0]"
              style={{ fontSize: '16px', fontFamily: 'var(--font-inter)', lineHeight: '1.65' }}
            >
              {TRANSLATIONS.body2}
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-col gap-5">
              {[
                { num: TRANSLATIONS.stat1Num, lab: TRANSLATIONS.stat1Lab },
                { num: TRANSLATIONS.stat2Num, lab: TRANSLATIONS.stat2Lab },
                { num: TRANSLATIONS.stat3Num, lab: TRANSLATIONS.stat3Lab },
              ].map((s) => (
                <div key={s.num} className="flex flex-col">
                  <span
                    className="text-[#00A859] font-extrabold"
                    style={{ fontSize: '32px', fontFamily: 'var(--font-jakarta)', lineHeight: '1.1' }}
                  >
                    {s.num}
                  </span>
                  <span
                    className="text-[#8FA3C0] mt-1"
                    style={{ fontSize: '14px', fontFamily: 'var(--font-inter)' }}
                  >
                    {s.lab}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — COMMUNITY FEED ── */}
          <div className="w-full lg:w-auto lg:flex-shrink-0" style={{ maxWidth: '340px' }}>
            <div className="flex flex-col gap-3">
              {REPORTS.map((r) => (
                <div
                  key={r.train}
                  className={`bg-[#162035] border border-[#1E2E42] rounded-2xl overflow-hidden ${r.fadeClass}`}
                  style={{ borderLeft: `3px solid ${r.leftBorder}` }}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold"
                        style={{ background: r.typeBg, color: r.typeColor, fontFamily: 'var(--font-inter)' }}
                      >
                        {r.emoji} {r.type}
                      </span>
                    </div>
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
                      style={{ fontSize: '12px', color: r.confirmColor, fontFamily: 'var(--font-inter)' }}
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
