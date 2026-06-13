'use client'

import { useI18n } from '@/lib/i18n'
import { Check, X, Crown, DownloadSimple, Lock } from '@phosphor-icons/react'
import { Link } from '@/lib/i18n/navigation'

// SVG payment logos rendered inline — no external images needed
function BkashLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center px-4 py-2.5 bg-bg-card border border-border-subtle rounded-lg ${className}`}>
      <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider font-inter">bKash</span>
    </div>
  )
}
function NagadLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center px-4 py-2.5 bg-bg-card border border-border-subtle rounded-lg ${className}`}>
      <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider font-inter">Nagad</span>
    </div>
  )
}
function RocketLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center px-4 py-2.5 bg-bg-card border border-border-subtle rounded-lg ${className}`}>
      <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider font-inter">Rocket</span>
    </div>
  )
}
function VisaLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center px-4 py-2.5 bg-bg-card border border-border-subtle rounded-lg ${className}`}>
      <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider font-inter italic">VISA</span>
    </div>
  )
}
function McLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center px-4 py-2.5 bg-bg-card border border-border-subtle rounded-lg ${className}`}>
      <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider font-inter">Mastercard</span>
    </div>
  )
}

export default function PricingSection() {
  const { t } = useI18n()
  const s = t.pricing_section

  const freeFeatures: string[] = [
    s.free_feature1, s.free_feature2, s.free_feature3, s.free_feature4, s.free_feature5,
  ]
  const proFeatures: string[] = [
    s.pro_feature1, s.pro_feature2, s.pro_feature3, s.pro_feature4,
    s.pro_feature5, s.pro_feature6, s.pro_feature7,
  ]

  return (
    <section id="pricing" className="py-20 md:py-28 bg-bg-elevated border-y border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-inter">
            {s.overline}
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary font-jakarta mb-3">
            {s.headline}
          </h2>
          <p className="text-text-secondary font-inter text-sm">{s.subheadline}</p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">

          {/* FREE card */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-7 flex flex-col">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-text-tertiary font-inter">
                {s.free_label}
              </span>
              <p className="text-4xl font-extrabold text-text-primary font-jakarta mt-1">
                {s.free_price}
              </p>
              <p className="text-text-tertiary text-sm font-inter mt-1">{s.free_period}</p>
            </div>

            <ul className="space-y-3 flex-1 mb-7">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={16} weight="bold" className="text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary text-sm font-inter">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/download"
              className="flex items-center justify-center gap-2 w-full py-3 border border-border-strong rounded-lg text-text-primary font-semibold text-sm font-inter hover:border-primary/50 hover:text-primary transition-all"
            >
              <DownloadSimple size={18} />
              {s.free_cta}
            </Link>
          </div>

          {/* PRO card */}
          <div className="relative bg-bg-card border-2 border-primary rounded-2xl p-7 flex flex-col shadow-lg shadow-primary/10">
            {/* Most Popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full font-inter">
                {s.pro_badge}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-primary font-inter">
                  {s.pro_label}
                </span>
                <Crown size={14} className="text-accent" weight="fill" />
              </div>
              <p className="text-4xl font-extrabold text-text-primary font-jakarta mt-1">
                {s.pro_price}
              </p>
              <p className="text-accent text-sm font-semibold font-inter mt-1">
                {s.pro_subprice}
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-7">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={16} weight="bold" className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary text-sm font-inter">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/download"
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary-dim text-white rounded-lg font-semibold text-sm font-inter transition-colors shadow-md shadow-primary/20"
            >
              {s.pro_cta}
            </Link>

            <p className="text-center text-text-tertiary text-xs font-inter mt-3">
              {s.trial_note}
            </p>
          </div>
        </div>

        {/* Payment methods — Coming Soon */}
        <div className="max-w-3xl mx-auto">
          <div className="p-6 bg-bg-card border border-border-subtle rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-5">
              <Lock size={16} className="text-text-tertiary" />
              <p className="text-text-secondary text-sm font-semibold font-inter text-center">
                {s.payment_label}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 opacity-50">
              <BkashLogo />
              <NagadLogo />
              <RocketLogo />
              <VisaLogo />
              <McLogo />
            </div>

            <p className="text-center text-text-tertiary text-xs font-inter mt-5 max-w-md mx-auto">
              {s.payment_note}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
