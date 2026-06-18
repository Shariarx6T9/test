'use client'

import { useI18n } from '@/lib/i18n'
import { ChartBar, Buildings, Code, EnvelopeSimple, ArrowRight } from '@phosphor-icons/react'

export default function BusinessSection() {
  const { t } = useI18n()
  const s = t.business_section

  // All business CTAs point to register-interest mailto until the product launches.
  const INTEREST_MAILTO = 'mailto:hello@railmatebd.com?subject=RailMate%20Business%20Interest'

  const cards = [
    {
      icon: <ChartBar size={28} weight="duotone" className="text-primary" />,
      title: s.card1_title,
      body: s.card1_body,
      cta: s.card1_cta,
      href: INTEREST_MAILTO,
    },
    {
      icon: <Buildings size={28} weight="duotone" className="text-primary" />,
      title: s.card2_title,
      body: s.card2_body,
      cta: s.card2_cta,
      href: INTEREST_MAILTO,
    },
    {
      icon: <Code size={28} weight="duotone" className="text-primary" />,
      title: s.card3_title,
      body: s.card3_body,
      cta: s.card3_cta,
      href: INTEREST_MAILTO,
    },
  ]

  return (
    <section id="business" className="py-20 md:py-28 bg-bg-base">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-inter">
            {s.overline}
          </p>
          {/* Beta gate label — keeps framing honest until post-launch */}
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold font-inter border border-primary/20">
            Launching after our public beta
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary font-jakarta mb-4">
            {s.headline}
          </h2>
          <p className="text-text-secondary leading-relaxed font-inter">
            {s.subheadline}
          </p>
        </div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group p-7 bg-bg-elevated border border-border-subtle rounded-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-200 flex flex-col"
              style={{ borderLeft: '3px solid var(--primary)' }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-text-primary font-inter mb-3">
                {card.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed font-inter flex-1 mb-5">
                {card.body}
              </p>
              <a
                href={card.href}
                className="inline-flex items-center gap-2 text-primary text-sm font-semibold font-inter hover:gap-3 transition-all"
              >
                {card.cta}
                <ArrowRight size={16} weight="bold" />
              </a>
            </div>
          ))}
        </div>

        {/* Contact emails */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 bg-bg-elevated border border-border-subtle rounded-xl">
          <a
            href="mailto:hello@railmatebd.com"
            className="inline-flex items-center gap-2.5 text-text-secondary hover:text-primary transition-colors font-inter text-sm"
          >
            <EnvelopeSimple size={18} className="text-primary flex-shrink-0" />
            <span>{s.contact_partnerships}</span>
          </a>
          <div className="hidden sm:block w-px h-4 bg-border-subtle" />
          <a
            href="mailto:ads@railmatebd.com"
            className="inline-flex items-center gap-2.5 text-text-secondary hover:text-primary transition-colors font-inter text-sm"
          >
            <EnvelopeSimple size={18} className="text-primary flex-shrink-0" />
            <span>{s.contact_advertising}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
