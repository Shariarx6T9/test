'use client'

import DownloadButton from '@/components/ui/DownloadButton'
import { useI18n } from '@/lib/i18n'
import { CheckCircle } from '@phosphor-icons/react'

export default function HeroSection() {
  const { t } = useI18n()

  const badges = [t.hero.badge1, t.hero.badge2, t.hero.badge3]

  return (
    <section className="min-h-screen flex items-center pt-24" id="hero">
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 py-12 lg:py-24">

          {/* LEFT CONTENT */}
          <div className="flex-1 text-center lg:text-left space-y-8" style={{ maxWidth: '640px' }}>

            {/* Overline pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest font-inter">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t.hero.overline}
            </div>

            {/* Headline */}
            <h1 className="text-text-primary font-extrabold leading-[1.1] text-4xl md:text-5xl lg:text-7xl font-jakarta">
              {t.hero.headline1}
              <br />
              <span className="text-primary">{t.hero.headline2}.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-text-secondary text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-inter">
              {t.hero.subtitle}
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-card border border-border-subtle text-text-secondary text-sm font-medium font-inter"
                >
                  <CheckCircle size={18} className="text-primary" weight="fill" />
                  {badge}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <DownloadButton
                platform="google-play"
                href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL!}
              />
              <DownloadButton
                platform="apk"
                href={process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL!}
              />
            </div>
          </div>

          {/* RIGHT Phone Mockup */}
          <div className="hidden lg:block flex-1 max-w-[400px]">
            <PhoneMockup />
          </div>

        </div>
      </div>
    </section>
  )
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[300px] h-[600px] bg-bg-base rounded-[3rem] border-8 border-bg-elevated shadow-2xl overflow-hidden ring-4 ring-border-strong/10">
      {/* Screen Content Simulation */}
      <div className="h-full w-full bg-bg-elevated p-6 space-y-6">
        {/* App Status Bar */}
        <div className="flex justify-between items-center text-text-tertiary text-[10px] font-bold">
          <span>9:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-2 rounded-full border border-text-tertiary" />
          </div>
        </div>

        {/* App Content */}
        <div className="space-y-4">
          <div className="h-10 w-full bg-bg-card rounded-lg border border-border-subtle flex items-center px-3 gap-3">
             <div className="w-2 h-2 rounded-full bg-primary" />
             <div className="h-2 w-24 bg-border-subtle rounded" />
          </div>
          
          <div className="space-y-3">
             {[1, 2, 3].map(i => (
               <div key={i} className="p-4 bg-bg-card rounded-xl border border-border-subtle space-y-3 shadow-sm">
                  <div className="flex justify-between">
                    <div className="h-2.5 w-20 bg-text-tertiary/20 rounded" />
                    <div className="h-2.5 w-8 bg-primary/20 rounded" />
                  </div>
                  <div className="h-2 w-full bg-border-subtle rounded" />
                  <div className="flex gap-2">
                    <div className="h-1.5 w-10 bg-border-subtle rounded" />
                    <div className="h-1.5 w-10 bg-border-subtle rounded" />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
      
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-bg-elevated rounded-b-2xl" />
    </div>
  )
}
