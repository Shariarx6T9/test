import SectionHeader from '@/components/ui/SectionHeader'

const COPY = {
  headline:    'Travel smarter. Upgrade to Pro.',
  subheadline: 'Core features are free forever. Pro unlocks the tools frequent travelers need.',
  monthly:     '৳99 / month',
  monthlyLab:  'Monthly Plan',
  annual:      '৳799 / year',
  annualLab:   'Best Value · Save 33%',
  popular:     'MOST POPULAR',
  trialNote:   '7-day free trial · Cancel anytime · No commitment',
  cta:         'Start Free Trial →',
}

const TABLE_ROWS = [
  { feature: 'Train schedules & fares',  free: '✓',     pro: '✓'   },
  { feature: 'Community reports',         free: '✓',     pro: '✓'   },
  { feature: 'Saved routes',              free: '3 max', pro: '∞'   },
  { feature: 'Departure alerts',          free: '1/day', pro: '∞'   },
  { feature: 'Delay notifications',       free: '—',     pro: '✓'   },
  { feature: 'Offline schedule access',   free: '—',     pro: '✓'   },
  { feature: 'Home screen widgets',       free: '—',     pro: '✓'   },
  { feature: 'Cross-device sync',         free: '—',     pro: '✓'   },
  { feature: 'Ad-free experience',        free: '—',     pro: '✓'   },
]

function cellColor(val: string, col: 'free' | 'pro') {
  if (val === '✓' && col === 'free') return '#00C977'
  if (val === '✓' && col === 'pro')  return '#F5A623'
  if (val === '—')                   return '#4E6480'
  return col === 'pro' ? '#F5A623' : '#8FA3C0'
}

export default function PremiumSection() {
  return (
    <section className="bg-[#0F1929] py-20" id="premium">
      <div className="max-w-[1200px] mx-auto px-6">

        <SectionHeader headline={COPY.headline} subheadline={COPY.subheadline} />

        {/* Table */}
        <div className="mx-auto mt-12 overflow-x-auto" style={{ maxWidth: '640px' }}>
          <table
            className="w-full border-collapse text-sm"
            style={{ border: '1px solid #1E2E42', borderRadius: '16px', overflow: 'hidden' }}
          >
            <thead>
              <tr style={{ background: '#1A2840' }}>
                <th
                  className="text-left px-4 py-3 border-b border-r border-[#1E2E42]"
                  style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4E6480' }}
                >
                  Feature
                </th>
                <th
                  className="px-4 py-3 border-b border-r border-[#1E2E42] text-center"
                  style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8FA3C0' }}
                >
                  Free
                </th>
                <th
                  className="px-4 py-3 border-b text-center"
                  style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F5A623', background: 'rgba(245,166,35,0.08)' }}
                >
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row) => (
                <tr key={row.feature} className="table-row border-b border-[#1E2E42] last:border-0">
                  <td
                    className="px-4 py-3 border-r border-[#1E2E42]"
                    style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: '#8FA3C0' }}
                  >
                    {row.feature}
                  </td>
                  <td
                    className="px-4 py-3 text-center border-r border-[#1E2E42] font-medium"
                    style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: cellColor(row.free, 'free') }}
                  >
                    {row.free}
                  </td>
                  <td
                    className="px-4 py-3 text-center font-medium"
                    style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: cellColor(row.pro, 'pro'), background: 'rgba(245,166,35,0.03)' }}
                  >
                    {row.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing pills */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

          {/* Monthly */}
          <div
            className="rounded-2xl border border-[#2A3F57] p-6 text-center"
            style={{ minWidth: '180px', background: '#162035' }}
          >
            <p className="text-[#F0F4FF] font-bold" style={{ fontSize: '24px', fontFamily: 'var(--font-inter)' }}>
              {COPY.monthly}
            </p>
            <p className="text-[#8FA3C0] mt-1" style={{ fontSize: '12px', fontFamily: 'var(--font-inter)' }}>
              {COPY.monthlyLab}
            </p>
          </div>

          {/* Annual — highlighted */}
          <div
            className="relative rounded-2xl p-6 text-center"
            style={{ minWidth: '200px', background: 'rgba(245,166,35,0.06)', border: '2px solid #F5A623' }}
          >
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: '#F5A623', color: '#080D17', fontSize: '10px', fontFamily: 'var(--font-inter)', fontWeight: 700, letterSpacing: '0.06em' }}
            >
              {COPY.popular}
            </div>
            <p className="font-bold" style={{ fontSize: '24px', fontFamily: 'var(--font-inter)', color: '#F5A623' }}>
              {COPY.annual}
            </p>
            <p className="mt-1" style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', color: '#F5A623' }}>
              {COPY.annualLab}
            </p>
          </div>
        </div>

        {/* Trial note */}
        <p className="text-center mt-4 text-[#4E6480]" style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
          {COPY.trialNote}
        </p>

        {/* CTA button */}
        <div className="flex justify-center mt-6">
          <a
            href="#download"
            className="block bg-[#00A859] hover:bg-[#007A40] text-[#080D17] font-bold rounded-md text-center transition-colors duration-150"
            style={{ width: '100%', maxWidth: '320px', height: '52px', lineHeight: '52px', fontSize: '16px', fontFamily: 'var(--font-jakarta)' }}
          >
            {COPY.cta}
          </a>
        </div>

      </div>
    </section>
  )
}
