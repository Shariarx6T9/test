// components/sections/HeroSection.tsx
'use client'

import Image from 'next/image'
import DownloadButton from '@/components/ui/DownloadButton'
import { useI18n } from '@/lib/i18n'
import { useRouter } from '@/lib/i18n/navigation'
import { CheckCircle, MagnifyingGlass } from '@phosphor-icons/react'

export default function HeroSection() {
  const { t } = useI18n()

  const badges = [t.hero.badge1, t.hero.badge2, t.hero.badge3]
  const router = useRouter()

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    router.push('/search')
  }

  return (
    <section
      className="relative flex items-center pt-20 pb-12 md:pt-24 md:pb-16 lg:min-h-[88vh]"
      id="hero"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">

          {/* LEFT CONTENT */}
          <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-7 w-full lg:max-w-[460px] lg:flex-none lg:w-[42%]">

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
              <span className="text-primary">{t.hero.headline2}</span>
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
                href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || "#"}
                status={!process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL === "#" ? "coming-soon" : "available"}
                className="w-full sm:w-auto justify-center"
              />
              <DownloadButton
                platform="app-store"
                href={process.env.NEXT_PUBLIC_APP_STORE_URL || "#"}
                status={!process.env.NEXT_PUBLIC_APP_STORE_URL || process.env.NEXT_PUBLIC_APP_STORE_URL === "#" ? "coming-soon" : "available"}
                className="w-full sm:w-auto justify-center"
              />
            </div>

            {/* Quick search — primary entry point to train schedule search */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center gap-2 mt-1 p-1.5 bg-bg-elevated border border-border-subtle rounded-xl shadow-sm hover:border-primary/30 transition-colors"
              aria-label={t.hero.search_label}
            >
              <MagnifyingGlass
                size={18}
                className="text-primary ml-2 flex-shrink-0"
                aria-hidden="true"
              />
              <input
                type="text"
                readOnly
                onClick={() => router.push('/search')}
                placeholder={t.hero.search_placeholder}
                className="flex-1 bg-transparent text-text-secondary placeholder-text-tertiary text-sm font-inter py-2 cursor-pointer focus:outline-none"
                aria-label={t.hero.search_label}
              />
              <button
                type="submit"
                className="flex-shrink-0 h-9 px-4 bg-primary text-white text-xs font-bold font-inter rounded-lg hover:bg-primary-dim transition-colors whitespace-nowrap"
              >
                {t.hero.search_cta}
              </button>
            </form>
          </div>

          {/* RIGHT Hero Visual */}
          <div className="relative w-full max-w-[560px] sm:max-w-full mx-auto lg:mx-0 lg:flex-none lg:w-[55%]">
            {/* Premium glow backdrop */}
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-3xl bg-primary/10 blur-3xl -z-10 pointer-events-none"
            />
            <Image
              src="/hero-mockup.png"
              alt="RailMate app overview — train schedules, fares, journey planner, live alerts and the national rail network map"
              width={1672}
              height={941}
              priority
              sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 55vw"
              className="w-full h-auto rounded-2xl border border-border-subtle shadow-[0_28px_72px_-8px_rgba(0,0,0,0.32),0_0_0_1px_rgba(0,168,89,0.08)]"
            />
          </div>

        </div>
      </div>
    </section>
  )
}