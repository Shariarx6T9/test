// components/sections/HeroSection.tsx
'use client'

import Image from 'next/image'
import DownloadButton from '@/components/ui/DownloadButton'
import { useI18n } from '@/lib/i18n'
import { CheckCircle } from '@phosphor-icons/react'

export default function HeroSection() {
  const { t } = useI18n()

  const badges = [t.hero.badge1, t.hero.badge2, t.hero.badge3]

  return (
    <section
      className="relative flex items-center pt-20 pb-12 md:pt-24 md:pb-16 lg:min-h-[88vh]"
      id="hero"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* LEFT CONTENT */}
          <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-7 w-full lg:max-w-[600px]">

            {/* Overline pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest font-inter">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t.hero.overline}
            </div>

            {/* Headline — capped lines on mobile per spec */}
            <h1 className="text-text-primary font-extrabold leading-[1.12] text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-jakarta">
              {t.hero.headline1}
              <br />
              <span className="text-primary">{t.hero.headline2}.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-text-secondary text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-inter">
              {t.hero.subtitle}
            </p>

            {/* Trust badges — 2x2 on mobile per spec, row on larger */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center lg:justify-start gap-3">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-bg-card border border-border-subtle text-text-secondary text-xs sm:text-sm font-medium font-inter"
                >
                  <CheckCircle size={16} className="text-primary flex-shrink-0" weight="fill" />
                  <span className="truncate">{badge}</span>
                </span>
              ))}
            </div>

            {/* CTA — full width stacked on mobile, side by side from sm */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
              <DownloadButton
                platform="google-play"
                href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL!}
                className="w-full sm:w-auto justify-center"
              />
              <DownloadButton
                platform="apk"
                href={process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL!}
                className="w-full sm:w-auto justify-center"
              />
            </div>
          </div>

          {/* RIGHT Phone Mockup */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[400px] lg:flex-1 mx-auto">
            <Image
              src="/hero-mockup.png"
              alt="RailMate app screenshot showing the train search screen"
              width={400}
              height={800}
              priority
              sizes="(max-width: 1024px) 320px, 400px"
              className="w-full h-auto"
            />
          </div>

        </div>
      </div>
    </section>
  )
}