const TRANSLATIONS = {
  headline:    'Travel smarter. Upgrade to Pro.',
  subheadline: 'Core features are free forever. Pro unlocks the tools frequent travelers need.',
  monthly:     '৳99 / month',
  monthlyLab:  'Monthly Plan',
  annual:      '৳799 / year',
  annualLab:   'Best Value · Save 33%',
  popular:     'MOST POPULAR',
  trialNote:   '7-day free trial · Cancel anytime · No commitment',
  ctaBtn:      'Start Free Trial →',
}

const TABLE_ROWS = [
  { feature: 'Train schedules & fares',  free: '✓',      pro: '✓'   },
  { feature: 'Community reports',         free: '✓',      pro: '✓'   },
  { feature: 'Saved routes',              free: '3 max',  pro: '∞'   },
  { feature: 'Departure alerts',          free: '1/day',  pro: '∞'   },
  { feature: 'Delay notifications',       free: '—',      pro: '✓'   },
  { feature: 'Offline schedule access',   free: '—',      pro: '✓'   },
  { feature: 'Home screen widgets',       free: '—',      pro: '✓'   },
  { feature: 'Cross-device sync',         free: '—',      pro: '✓'   },
  { feature: 'Ad-free experience',        free: '—',      pro: '✓'   },
]

function cellStyle(val: string, type: 'free' | 'pro') {
  if (val === '✓' && type === 'free') return { color: '#00C977' }
  if (val === '✓' && type === 'pro')  return { color: '#F5A623' }
  if (val === '—')                    return { color: '#4E6480' }
  if (type === 'pro')                 return { color: '#F5A623' }
  return { color: '#8FA3C0' }
}

export default function PremiumSection() {
  return (
    <section className="bg-[#0F1929] py-20" id="premium">
      <div className="container-inner">

        {/* Headlines */}
        <div className="text-center max-w-[680px] mx-auto">
          <h2
            className="text-[#F0F4FF] font-extrabold"
            style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontFamily: 'var(--font-jakarta)', lineHeight: '1.2' }}
          >
            {TRANSLATIONS.headline}
          </h2>
          <p
            className="mt-3 text-[#8FA3C0]"
            style={{ fontSize: '16px', fontFamily: 'var(--font-inter)', lineHeight: '1.6' }}
          >
            {TRANSLATIONS.subheadline}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mx-auto mt-12 overflow-x-auto" style={{ maxWidth: '640px' }}>
          <table className="w-full border-collapse border border-[#1E2E42] rounded-2xl overflow-hidden text-sm">
            {/* Header */}
            <thead>
              <tr style={{ background: '#1A2840' }}>
                <th
                  className="text-left px-4 py-3 text-[#4E6480] border-b border-r border-[#1E2E42]"
                  style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
                >
                  Feature
                </th>
                <th
                  className="px-4 py-3 text-[#8FA3C0] border-b border-r border-[#1E2E42]"
                  style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
                >
                  Free
                </th>
                <th
                  className="px-4 py-3 border-b border-[#1E2E42]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#F5A623',
                    background: 'rgba(245,166,35,0.08)',
                  }}
                >
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row) => (
                <tr key={row.feature} className="table-row border-b border-[#1E2E42] last:border-0">
                  <td
                    className="px-4 py-3 text-[#8FA3C0] border-r border-[#1E2E42]"
                    style={{ fontFamily: 'var(--font-inter)', fontSize: '14px' }}
                  >
                    {row.feature}
                  </td>
                  <td
                    className="px-4 py-3 text-center border-r border-[#1E2E42] font-medium"
                    style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', ...cellStyle(row.free, 'free') }}
                  >
                    {row.free}
                  </td>
                  <td
                    className="px-4 py-3 text-center font-medium"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '14px',
                      background: 'rgba(245,166,35,0.04)',
                      ...cellStyle(row.pro, 'pro'),
                    }}
                  >
                    {row.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

          {/* Monthly */}
          <div
            className="rounded-2xl border border-[#2A3F57] p-6 text-center"
            style={{ minWidth: '180px', background: '#162035' }}
          >
            <p
              className="text-[#F0F4FF] font-bold"
              style={{ fontSize: '24px', fontFamily: 'var(--font-inter)' }}
            >
              {TRANSLATIONS.monthly}
            </p>
            <p
              className="text-[#8FA3C0] mt-1"
              style={{ fontSize: '12px', fontFamily: 'var(--font-inter)' }}
            >
              {TRANSLATIONS.monthlyLab}
            </p>
          </div>

          {/* Annual (highlighted) */}
          <div className="relative rounded-2xl p-6 text-center" style={{
            minWidth: '200px',
            background: 'rgba(245,166,35,0.06)',
            border: '2px solid #F5A623',
          }}>
            {/* MOST POPULAR badge */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[#080D17]"
              style={{ background: '#F5A623', fontSize: '10px', fontFamily: 'var(--font-inter)', fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}
            >
              {TRANSLATIONS.popular}
            </div>
            <p
              className="font-bold"
              style={{ fontSize: '24px', fontFamily: 'var(--font-inter)', color: '#F5A623' }}
            >
              {TRANSLATIONS.annual}
            </p>
            <p
              style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', color: '#F5A623', marginTop: '4px' }}
            >
              {TRANSLATIONS.annualLab}
            </p>
          </div>
        </div>

        {/* Trial note */}
        <p
          className="text-center mt-4 text-[#4E6480]"
          style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}
        >
          {TRANSLATIONS.trialNote}
        </p>

        {/* CTA */}
        <div className="flex justify-center mt-6">
          <a
            href="#download"
            className="bg-[#00A859] hover:bg-[#007A40] text-[#080D17] font-bold rounded-md text-center transition-colors duration-150"
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '320px',
              height: '52px',
              lineHeight: '52px',
              fontSize: '16px',
              fontFamily: 'var(--font-jakarta)',
            }}
          >
            {TRANSLATIONS.ctaBtn}
          </a>
        </div>

      </div>
    </section>
  )
}
