'use client'

import SectionHeader from '@/components/ui/SectionHeader'
import { useI18n } from '@/lib/i18n'
import { Warning, SquaresFour, CurrencyCircleDollar } from '@phosphor-icons/react'

export default function ProblemSection() {
  const { t } = useI18n()

  const painPoints = [
    {
      icon: <Warning size={32} weight="duotone" className="text-danger" />,
      title: 'Is my train even on time?',
      body: 'You leave home, reach the station, and only then find out your train is delayed 45 minutes. No app warned you. No one knew.',
      bg: 'bg-danger/5',
      border: 'border-danger/20',
    },
    {
      icon: <SquaresFour size={32} weight="duotone" className="text-accent" />,
      title: '3 apps for 1 journey',
      body: "BR website for schedules. Shohoz for tickets. WhatsApp groups for delay news. There's no single place that does everything.",
      bg: 'bg-accent/5',
      border: 'border-accent/20',
    },
    {
      icon: <CurrencyCircleDollar size={32} weight="duotone" className="text-info" />,
      title: 'What does this ticket actually cost?',
      body: "Fare tables are buried in PDFs. Prices differ by class, season, and nobody tells you that Snigdha isn't available on this route.",
      bg: 'bg-info/5',
      border: 'border-info/20',
    },
  ]

  return (
    <section className="bg-bg-elevated py-24" id="problem">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader 
          title={t.sections.problem.title} 
          subtitle={t.sections.problem.subtitle} 
          centered 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {painPoints.map((p, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 border ${p.bg} ${p.border} transition-transform hover:-translate-y-1`}
            >
              <div className="mb-6">{p.icon}</div>
              <h3 className="text-text-primary font-bold text-xl mb-4 font-jakarta leading-tight">
                {p.title}
              </h3>
              <p className="text-text-secondary leading-relaxed font-inter text-sm">
                {p.body}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 font-bold text-primary text-xl font-jakarta">
          RailMate fixes all three. For free.
        </p>
      </div>
    </section>
  )
}
