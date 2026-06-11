import Navbar           from '@/components/Navbar'
import HeroSection      from '@/components/HeroSection'
import ProblemSection   from '@/components/ProblemSection'
import FeaturesSection  from '@/components/FeaturesSection'
import CommunitySection from '@/components/CommunitySection'
import StatsSection     from '@/components/StatsSection'
import PremiumSection   from '@/components/PremiumSection'
import DownloadCTA      from '@/components/DownloadCTA'
import Footer           from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <CommunitySection />
        <StatsSection />
        <PremiumSection />
        <DownloadCTA />
      </main>
      <Footer />
    </>
  )
}
