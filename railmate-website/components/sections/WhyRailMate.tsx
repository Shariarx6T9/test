import SectionHeader from '@/components/ui/SectionHeader'

const COPY = {
  overline:    'WHY RAILMATE',
  headline:    'Built for how Bangladeshis actually travel.',
  subheadline: "Other tools are generic. RailMate was designed from day one for Bangladesh Railway's specific routes, classes, and realities.",
}

const COMPARISONS = [
  {
    label:    'BR Official Website',
    details:  ['Schedule data ✓', 'Fare info ✗', 'Delay reports ✗', 'Works offline ✗', 'Bengali UI ✗'],
    highlight: false,
  },
  {
    label:    'RailMate',
    details:  ['Schedule data ✓', 'Fare info ✓', 'Delay reports ✓', 'Works offline ✓', 'Bengali UI ✓'],
    highlight: true,
  },
  {
    label:    'Other Rail Apps',
    details:  ['Schedule data ✓', 'Fare info partial', 'Delay reports ✗', 'Works offline ✗', 'Bengali UI ✗'],
    highlight: false,
  },
]

const DIFFERENTIATORS = [
  {
    num:   '01',
    title: 'Offline-first architecture',
    body:  'We cache the entire BR schedule to your device on install. No signal? No problem. Your 3am platform change at Akhaura still works.',
  },
  {
    num:   '02',
    title: 'Community over automation',
    body:  "We don't pretend to have a real-time BR API — it doesn't exist. Instead we rely on real travelers who are on those trains right now.",
  },
  {
    num:   '03',
    title: 'Bengali is first-class',
    body:  "Station names in Bengali aren't an afterthought. Noto Sans Bengali renders every district and junction name the way it should look.",
  },
  {
    num:   '04',
    title: 'Honest about data limits',
    body:  'We show the last-verified date on every schedule. We never present stale data as live. You always know what you can trust.',
  },
]

export default function WhyRailMate() {
  return (
    <section className="bg-[#080D17] py-20" id="why">
      <div className="max-w-[1200px] mx-auto px-6">

        <SectionHeader overline={COPY.overline} headline={COPY.headline} subheadline={COPY.subheadline} />

        {/* Comparison columns */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[800px] mx-auto">
          {COMPARISONS.map((col) => (
            <div
              key={col.label}
              className="rounded-2xl p-5"
              style={
                col.highlight
                  ? { background: 'rgba(0,168,89,0.08)', border: '1.5px solid rgba(0,168,89,0.35)' }
                  : { background: '#0F1929',              border: '1px solid #1E2E42' }
              }
            >
              <p
                className="font-bold mb-4"
                style={{
                  fontSize: '14px',
                  fontFamily: 'var(--font-jakarta)',
                  color: col.highlight ? '#00A859' : '#8FA3C0',
                }}
              >
                {col.highlight && <span className="mr-1">★ </span>}
                {col.label}
              </p>
              <ul className="flex flex-col gap-2">
                {col.details.map((d) => {
                  const ok = d.includes('✓')
                  const no = d.includes('✗')
                  return (
                    <li
                      key={d}
                      className="flex items-center gap-2"
                      style={{
                        fontSize: '13px',
                        fontFamily: 'var(--font-inter)',
                        color: ok ? '#F0F4FF' : no ? '#4E6480' : '#8FA3C0',
                      }}
                    >
                      <span style={{ color: ok ? '#00C977' : no ? '#E8394B' : '#F5A623', fontSize: '11px' }}>
                        {ok ? '●' : no ? '●' : '◐'}
                      </span>
                      {d.replace(' ✓', '').replace(' ✗', '').replace(' partial', '')}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Differentiator grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[840px] mx-auto">
          {DIFFERENTIATORS.map((d) => (
            <div key={d.num} className="flex gap-4">
              <span
                className="text-[#00A859] font-extrabold flex-shrink-0 mt-0.5"
                style={{ fontSize: '13px', fontFamily: 'var(--font-jakarta)', letterSpacing: '0.04em' }}
              >
                {d.num}
              </span>
              <div>
                <h3
                  className="text-[#F0F4FF] font-bold mb-1.5"
                  style={{ fontSize: '16px', fontFamily: 'var(--font-jakarta)' }}
                >
                  {d.title}
                </h3>
                <p
                  className="text-[#8FA3C0]"
                  style={{ fontSize: '14px', fontFamily: 'var(--font-inter)', lineHeight: '1.65' }}
                >
                  {d.body}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
