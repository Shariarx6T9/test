import HeroSection         from '@/components/sections/HeroSection'
import ProblemSection      from '@/components/sections/ProblemSection'
import FeaturesSection     from '@/components/sections/FeaturesSection'
import WhyRailMate         from '@/components/sections/WhyRailMate'
import CommunitySection    from '@/components/sections/CommunitySection'
import UserBenefits        from '@/components/sections/UserBenefits'
import ScreenshotsCarousel from '@/components/sections/ScreenshotsCarousel'
import StatsSection        from '@/components/sections/StatsSection'
import PremiumSection      from '@/components/sections/PremiumSection'
import DownloadCTA         from '@/components/sections/DownloadCTA'

export default function Home() {
  return (
    <>
      {/* 1 — Hook: what it is, download it now */}
      <HeroSection />

      {/* 2 — Agitate the pain */}
      <ProblemSection />

      {/* 3 — Show the solution */}
      <FeaturesSection />

      {/* 4 — Why us over alternatives */}
      <WhyRailMate />

      {/* 5 — Community proof */}
      <CommunitySection />

      {/* 6 — Who it's for */}
      <UserBenefits />

      {/* 7 — See it in action */}
      <ScreenshotsCarousel />

      {/* 8 — Social proof numbers */}
      <StatsSection />

      {/* 9 — Upgrade path */}
      <PremiumSection />

      {/* 10 — Final CTA */}
      <DownloadCTA />
    </>
  )
}
