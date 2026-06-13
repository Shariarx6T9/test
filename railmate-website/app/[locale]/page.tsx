import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import CommunitySection from '@/components/sections/CommunitySection'
import PricingSection from '@/components/sections/PricingSection'
import BusinessSection from '@/components/sections/BusinessSection'
import { FAQAccordion } from './faq/FAQAccordion'
import { TrustDisclaimer } from '@/components/sections/TrustDisclaimer'
import LegalSection from '@/components/sections/LegalSection'
import DownloadCTA from '@/components/sections/DownloadCTA'

export default function Home() {
  return (
    <>
      {/* 1. Hero: What it is, primary CTA */}
      <HeroSection />

      {/* 2. About: Who we are — required for payment gateway review */}
      <AboutSection />

      {/* 3. Features: Key benefits */}
      <FeaturesSection />

      {/* 4. Community: Live intelligence layer */}
      <CommunitySection />

      {/* 5. Pricing: Free vs Pro + payment methods */}
      <PricingSection />

      {/* 6. For Business: Advertising & partnerships */}
      <BusinessSection />

      {/* 7. FAQ: Reduce conversion friction */}
      <FAQAccordion homepage />

      {/* 8. Trust & Credibility: Disclaimer */}
      <TrustDisclaimer />

      {/* 9. Legal compliance links */}
      <LegalSection />

      {/* 10. Final CTA */}
      <DownloadCTA />
    </>
  )
}
