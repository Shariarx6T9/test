'use client'

import { useI18n } from '@/lib/i18n'
import { FacebookLogo, TwitterLogo, Train, EnvelopeSimple } from '@phosphor-icons/react'
import { Link } from '@/lib/i18n/navigation'

export default function Footer() {
  const { t } = useI18n()

  const productLinks = [
    { label: t.nav.features,   href: '/features' },
    { label: t.nav.download,   href: '/download' },
    { label: t.footer.pro,     href: '/#pricing' },
    { label: t.nav.community,  href: '/#community' },
  ]

  const companyLinks = [
    { label: t.nav.about,      href: '/about' },
    { label: t.footer.partnerships, href: '/#business' },
    { label: t.footer.advertising,  href: '/#business' },
    { label: t.nav.contact,    href: '/contact' },
  ]

  const legalLinks = [
    { label: t.footer.privacy,           href: '/privacy' },
    { label: t.footer.terms,             href: '/terms' },
    { label: t.footer.copyright_notice,  href: '/copyright' },
    { label: t.nav.faq,                  href: '/faq' },
  ]

  const socialLinks = [
    { label: 'Facebook', icon: <FacebookLogo size={18} />, href: '#' },
    { label: 'Twitter',  icon: <TwitterLogo size={18} />,  href: '#' },
  ]

  return (
    <footer className="bg-bg-elevated border-t border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* 4-column grid: Brand | Product | Company | Legal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Col 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Train size={16} weight="fill" className="text-primary" />
              </div>
              <span className="text-text-primary font-bold text-base font-jakarta">
                {t.common.brand}
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed font-inter max-w-xs">
              {t.footer.brand_desc}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-8 h-8 flex items-center justify-center bg-bg-card rounded-full text-text-tertiary hover:text-primary border border-border-subtle hover:border-primary/30 transition-all"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            {/* Contact email */}
            <a
              href="mailto:support@railmatebd.com"
              className="inline-flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors text-xs font-inter"
            >
              <EnvelopeSimple size={14} />
              support@railmatebd.com
            </a>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-text-primary font-bold uppercase tracking-wider text-xs mb-5 font-inter">
              {t.footer.product}
            </h4>
            <ul className="space-y-3.5">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-text-secondary hover:text-primary transition-colors font-inter text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-text-primary font-bold uppercase tracking-wider text-xs mb-5 font-inter">
              {t.footer.company}
            </h4>
            <ul className="space-y-3.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-text-secondary hover:text-primary transition-colors font-inter text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <h4 className="text-text-primary font-bold uppercase tracking-wider text-xs mb-5 font-inter">
              {t.footer.legal}
            </h4>
            <ul className="space-y-3.5">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-text-secondary hover:text-primary transition-colors font-inter text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Legal contact note */}
            <div className="mt-6 p-3 bg-bg-card border border-border-subtle rounded-lg">
              <p className="text-text-tertiary text-xs leading-relaxed font-inter">
                {t.footer.legal_short}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-7 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-tertiary text-xs font-inter">
            {t.footer.copyright}
          </p>
          <p className="text-text-tertiary text-xs font-inter text-center">
            {t.footer.data_notice_short}
          </p>
          <p className="text-text-tertiary text-xs font-inter">
            {t.footer.built_in_bangladesh}
          </p>
        </div>
      </div>
    </footer>
  )
}
