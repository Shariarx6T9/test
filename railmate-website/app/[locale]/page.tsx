import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import CommunitySection from '@/components/sections/CommunitySection'
import ScreenshotsCarousel from '@/components/sections/ScreenshotsCarousel'
import DownloadCTA from '@/components/sections/DownloadCTA'
import { FAQAccordion } from './faq/FAQAccordion'
import { TrustDisclaimer } from '@/components/sections/TrustDisclaimer'

export default function Home() {
  return (
    <>
      {/* 1. Hero: What it is, what it does, and primary CTA */}
      <HeroSection />

      {/* 2. Screenshots: Show, don't just tell. */}
      <ScreenshotsCarousel />

      {/* 3. Features: 3-6 key benefits. */}
      <FeaturesSection />

      {/* 4. Community: Explain the 'community intelligence' aspect. */}
      <CommunitySection />

      {/* 5. FAQ Preview: Answer top questions to reduce friction. */}
      <FAQAccordion homepage />

      {/* 6. Trust & Credibility: Legal and disclaimer. */}
      <TrustDisclaimer />

      {/* 7. Final CTA: Last chance to convert. */}
      <DownloadCTA />
    </>
  )
}
