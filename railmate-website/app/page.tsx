import HeroSection from "@/components/sections/HeroSection";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import WhyRailMate from "@/components/sections/WhyRailMate";
import CommunitySection from "@/components/sections/CommunitySection";
import ScreenshotsCarousel from "@/components/sections/ScreenshotsCarousel";
import UserBenefits from "@/components/sections/UserBenefits";
import DownloadCTA from "@/components/sections/DownloadCTA";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Your Railway, Simplified.",
  description: "RailMate is Bangladesh's most trusted railway companion app. Real-time schedules, fares, community reports, and smart journey tools. Download free on Android.",
});

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-base">
      <HeroSection />
      
      {/* Section Divider with subtle glow */}
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <FeaturesGrid />
      <WhyRailMate />
      <CommunitySection />
      <ScreenshotsCarousel />
      <UserBenefits />
      <DownloadCTA />
    </main>
  );
}
