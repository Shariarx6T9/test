'use client'

import { useI18n } from '@/lib/i18n'
import { Train, MapPin, Translate, ShieldWarning } from '@phosphor-icons/react'

export default function AboutSection() {
  const { t } = useI18n()
  const s = t.about_section

  const stats = [
    { num: s.stat1_num, label: s.stat1_label, icon: <Train size={20} className="text-primary" weight="fill" /> },
    { num: s.stat2_num, label: s.stat2_label, icon: <MapPin size={20} className="text-primary" weight="fill" /> },
    { num: s.stat3_num, label: s.stat3_label, icon: <Translate size={20} className="text-primary" weight="fill" /> },
  ]

  return (
    <section id="about" className="py-20 md:py-28 bg-bg-elevated border-y border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: Text */}
          <div className="space-y-6">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-inter">
                {s.overline}
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary font-jakarta leading-tight">
                {s.headline}
              </h2>
            </div>
            <p className="text-text-secondary leading-relaxed font-inter">
              {s.para1}
            </p>
            <p className="text-text-secondary leading-relaxed font-inter">
              {s.para2}
            </p>

            {/* Independence notice */}
            <div className="flex gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <ShieldWarning size={20} className="text-accent flex-shrink-0 mt-0.5" weight="fill" />
              <p className="text-text-secondary text-sm leading-relaxed font-inter">
                {s.legal_note}
              </p>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="space-y-4">
            {stats.map((stat) => (
              <div
                key={stat.num}
                className="flex items-center gap-5 p-5 bg-bg-card border border-border-subtle rounded-xl hover:border-primary/20 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-primary font-jakarta leading-none">
                    {stat.num}
                  </p>
                  <p className="text-text-secondary text-sm font-inter mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}

            {/* Beta badge */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-center">
              <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold font-inter">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                {s.beta_badge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
