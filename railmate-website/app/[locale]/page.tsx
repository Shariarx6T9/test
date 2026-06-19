import { getAllStations } from '@/lib/train-search'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import ScreenshotsCarousel from '@/components/sections/ScreenshotsCarousel'
import CommunitySection from '@/components/sections/CommunitySection'
import PricingSection from '@/components/sections/PricingSection'
import BusinessSection from '@/components/sections/BusinessSection'
import { FAQAccordion } from './faq/FAQAccordion'
import { TrustDisclaimer } from '@/components/sections/TrustDisclaimer'
import LegalSection from '@/components/sections/LegalSection'
import DownloadCTA from '@/components/sections/DownloadCTA'

// Revalidate station list every hour
export const revalidate = 3600

export default async function Home() {
  // Fetch stations server-side so the hero search card has autocomplete
  // data without a client-side round trip. This must NEVER throw — if
  // Supabase is unreachable or misconfigured, the homepage still renders
  // with an empty station list rather than 500ing the entire site.
  let stations: Awaited<ReturnType<typeof getAllStations>> = []
  try {
    stations = await getAllStations()
  } catch (err) {
    console.error('[Home] getAllStations failed — rendering with empty list:', err)
  }

  return (
    <>
      <HeroSection stations={stations} />
      <AboutSection />
      <FeaturesSection />
      <ScreenshotsCarousel />
      <CommunitySection />
      <PricingSection />
      <BusinessSection />
      <FAQAccordion homepage />
      <TrustDisclaimer />
      <LegalSection />
      <DownloadCTA />
    </>
  )
}
