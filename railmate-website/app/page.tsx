import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import CommunitySection from "@/components/sections/CommunitySection";
import StatsSection from "@/components/sections/StatsSection";
import PremiumSection from "@/components/sections/PremiumSection";
import DownloadCTA from "@/components/sections/DownloadCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <CommunitySection />
      <StatsSection />
      <PremiumSection />
      <DownloadCTA />
      <Footer />
    </main>
  );
}
