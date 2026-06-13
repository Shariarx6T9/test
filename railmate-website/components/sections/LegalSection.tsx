'use client'

import { useI18n } from '@/lib/i18n'
import { ShieldCheck, EnvelopeSimple } from '@phosphor-icons/react'
import { Link } from '@/lib/i18n/navigation'

export default function LegalSection() {
  const { t } = useI18n()
  const s = t.legal_section

  const legalLinks = [
    { label: s.privacy,  href: '/privacy' },
    { label: s.terms,    href: '/terms' },
    { label: s.cookies,  href: '/privacy#cookies' },
  ]

  return (
    <section id="legal" className="py-14 bg-bg-base border-t border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">

          {/* Icon + legal links row */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck size={20} className="text-primary" weight="duotone" />
            <span className="text-text-tertiary text-xs uppercase tracking-widest font-bold font-inter">
              {s.legal_overline}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {legalLinks.map((link, i) => (
              <span key={link.label} className="flex items-center gap-3 sm:gap-6">
                <Link
                  href={link.href}
                  className="text-text-secondary hover:text-primary transition-colors text-sm font-inter underline underline-offset-2"
                >
                  {link.label}
                </Link>
                {i < legalLinks.length - 1 && (
                  <span className="text-border-strong hidden sm:block">|</span>
                )}
              </span>
            ))}
          </div>

          {/* Company statement */}
          <p className="text-text-tertiary text-xs leading-relaxed font-inter max-w-lg mx-auto">
            {s.company_statement}
          </p>

          {/* Legal contact */}
          <a
            href="mailto:legal@railmatebd.com"
            className="inline-flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors text-xs font-inter"
          >
            <EnvelopeSimple size={14} />
            legal@railmatebd.com
          </a>

          {/* Data note */}
          <div className="mt-2 p-4 bg-bg-elevated border border-border-subtle rounded-lg">
            <p className="text-text-tertiary text-xs leading-relaxed font-inter">
              {s.data_note}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
