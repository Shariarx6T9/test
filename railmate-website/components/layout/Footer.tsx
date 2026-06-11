const COPY = {
  brand:     'RailMate',
  bengali:   'আপনার রেলযাত্রা, সহজ করা হলো।',
  notice:    'Schedule and fare data sourced from Bangladesh Railway official publications. Community reports are user-submitted. RailMate is not affiliated with Bangladesh Railway.',
  copyright: '© 2025 RailMate Bangladesh · Built with ❤️ in Bangladesh',
  dataLink:  'Data: railway.gov.bd',
}

const PRODUCT_LINKS = [
  { label: 'Home',      href: '#hero' },
  { label: 'Features',  href: '#features' },
  { label: 'Download',  href: '#download' },
  { label: 'FAQ',       href: '#faq' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy',     href: '#' },
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Copyright Notice',   href: '#' },
]

function LogoMark() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#00A859] flex items-center justify-center flex-shrink-0">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect x="3" y="2" width="12" height="10" rx="2.5" stroke="white" strokeWidth="1.4"/>
        <path d="M3 8h12" stroke="white" strokeWidth="1.4"/>
        <path d="M6 12l-1.5 3M12 12l1.5 3" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="6.5" cy="10" r=".9" fill="white"/>
        <circle cx="11.5" cy="10" r=".9" fill="white"/>
      </svg>
    </div>
  )
}

function SocialIcon({ path, label }: { path: string; label: string }) {
  return (
    <a href="#" aria-label={label} className="text-[#4E6480] hover:text-[#00A859] transition-colors">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d={path} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  )
}

const SOCIAL_ICONS = [
  { label: 'Facebook',  path: 'M13 7h-2a1 1 0 00-1 1v2h3l-.5 3H10v5M3.5 3.5h13a1 1 0 011 1v13a1 1 0 01-1 1h-13a1 1 0 01-1-1v-13a1 1 0 011-1z' },
  { label: 'Twitter',   path: 'M3 3l5.5 7.5L3 17h2l4.5-5.5L14 17h3l-5.8-8 5.3-6h-2l-3.8 4.5L6 3H3z' },
  { label: 'Instagram', path: 'M14 2H6a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V6a4 4 0 00-4-4zM10 13a3 3 0 110-6 3 3 0 010 6zm4.5-8a.75.75 0 110 1.5.75.75 0 010-1.5z' },
]

function FooterHeading({ children }: { children: string }) {
  return (
    <h4
      className="text-[#4E6480] uppercase mb-4"
      style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 600, letterSpacing: '0.06em' }}
    >
      {children}
    </h4>
  )
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <a
        href={href}
        className="text-[#8FA3C0] hover:text-[#F0F4FF] transition-colors"
        style={{ fontSize: '14px', fontFamily: 'var(--font-inter)' }}
      >
        {label}
      </a>
    </li>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#0F1929] border-t border-[#1E2E42]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pt-12 pb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <LogoMark />
              <span className="text-[#F0F4FF] font-bold text-[17px]" style={{ fontFamily: 'var(--font-jakarta)' }}>
                {COPY.brand}
              </span>
            </div>
            <p
              className="text-[#8FA3C0] mb-5 leading-relaxed"
              style={{ fontSize: '14px', fontFamily: 'var(--font-bengali)' }}
            >
              {COPY.bengali}
            </p>
            <div className="flex gap-4">
              {SOCIAL_ICONS.map((s) => (
                <SocialIcon key={s.label} path={s.path} label={s.label} />
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <FooterHeading>Product</FooterHeading>
            <ul className="flex flex-col gap-3">
              {PRODUCT_LINKS.map((l) => <FooterLink key={l.label} {...l} />)}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <FooterHeading>Legal</FooterHeading>
            <ul className="flex flex-col gap-3">
              {LEGAL_LINKS.map((l) => <FooterLink key={l.label} {...l} />)}
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <FooterHeading>Data Sources</FooterHeading>
            <p className="text-[#4E6480] leading-relaxed" style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
              {COPY.notice}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1E2E42] py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#4E6480]" style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
            {COPY.copyright}
          </p>
          <a
            href="https://www.railway.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4E6480] hover:text-[#8FA3C0] transition-colors"
            style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}
          >
            {COPY.dataLink}
          </a>
        </div>

      </div>
    </footer>
  )
}
