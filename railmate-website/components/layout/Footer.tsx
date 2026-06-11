const TRANSLATIONS = {
  tagline:    'আপনার রেলযাত্রা, সহজ করা হলো।',
  dataNotice: 'Schedule and fare data sourced from Bangladesh Railway official publications. Community reports are user-submitted. RailMate is not affiliated with Bangladesh Railway.',
  copyright:  '© 2025 RailMate Bangladesh · Built with ❤️ in Bangladesh',
  dataLink:   'Data: railway.gov.bd',
}

const PRODUCT_LINKS = [
  { label: 'Home',      href: '#' },
  { label: 'Features',  href: '#features' },
  { label: 'Download',  href: '#download' },
  { label: 'FAQ',       href: '#faq' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy',     href: '#' },
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Copyright Notice',   href: '#' },
]

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M13 7h-2a1 1 0 00-1 1v2h3l-.5 3H10v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 3l5.5 7.5L3 17h2l4.5-5.5L14 17h3l-6-8 5.5-6h-2l-4 4.5L6 3H3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="14.5" cy="5.5" r="0.75" fill="currentColor"/>
    </svg>
  )
}

function TrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4" y="3" width="12" height="11" rx="3" stroke="#00A859" strokeWidth="1.5"/>
      <path d="M4 9h12" stroke="#00A859" strokeWidth="1.5"/>
      <path d="M7 14l-1.5 3M13 14l1.5 3" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="7" cy="11.5" r="1" fill="#00A859"/>
      <circle cx="13" cy="11.5" r="1" fill="#00A859"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#0F1929] border-t border-[#1E2E42]">
      <div className="container-inner">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 pb-8">

          {/* COL 1 — Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#00A859] flex items-center justify-center">
                <TrainIcon />
              </div>
              <span
                className="text-[#F0F4FF] font-bold"
                style={{ fontSize: '17px', fontFamily: 'var(--font-jakarta)' }}
              >
                RailMate
              </span>
            </div>
            <p
              className="text-[#8FA3C0] mb-5"
              style={{ fontSize: '14px', fontFamily: 'var(--font-bengali)', lineHeight: '1.6' }}
            >
              {TRANSLATIONS.tagline}
            </p>
            <div className="flex gap-3">
              {[
                { Icon: FacebookIcon, label: 'Facebook' },
                { Icon: TwitterIcon,  label: 'Twitter' },
                { Icon: InstagramIcon,label: 'Instagram' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-[#4E6480] hover:text-[#00A859] transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* COL 2 — Product */}
          <div>
            <h4
              className="text-[#4E6480] uppercase mb-4"
              style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 600, letterSpacing: '0.06em' }}
            >
              Product
            </h4>
            <ul className="flex flex-col gap-2.5">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[#8FA3C0] hover:text-[#F0F4FF] transition-colors"
                    style={{ fontSize: '14px', fontFamily: 'var(--font-inter)' }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3 — Legal */}
          <div>
            <h4
              className="text-[#4E6480] uppercase mb-4"
              style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 600, letterSpacing: '0.06em' }}
            >
              Legal
            </h4>
            <ul className="flex flex-col gap-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[#8FA3C0] hover:text-[#F0F4FF] transition-colors"
                    style={{ fontSize: '14px', fontFamily: 'var(--font-inter)' }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 4 — Data Sources */}
          <div>
            <h4
              className="text-[#4E6480] uppercase mb-4"
              style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 600, letterSpacing: '0.06em' }}
            >
              Data Sources
            </h4>
            <p
              className="text-[#4E6480]"
              style={{ fontSize: '13px', fontFamily: 'var(--font-inter)', lineHeight: '1.6' }}
            >
              {TRANSLATIONS.dataNotice}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1E2E42] py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-[#4E6480]"
            style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}
          >
            {TRANSLATIONS.copyright}
          </p>
          <a
            href="https://www.railway.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4E6480] hover:text-[#8FA3C0] transition-colors"
            style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}
          >
            {TRANSLATIONS.dataLink}
          </a>
        </div>

      </div>
    </footer>
  )
}
