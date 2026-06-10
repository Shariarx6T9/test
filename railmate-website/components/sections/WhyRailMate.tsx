import { ShieldCheck, ChatTeardropText, GlobeSimple } from "@phosphor-icons/react/dist/ssr";
import SectionHeader from "../ui/SectionHeader";

const benefits = [
  {
    icon: ChatTeardropText,
    title: "Community-Powered Intelligence",
    description: "Our data isn't just static schedules. It's alive with real-time reports from thousands of commuters across Bangladesh.",
  },
  {
    icon: GlobeSimple,
    title: "Bengali-First Design",
    description: "Built specifically for our people. Every screen is optimized for both Bengali and English, ensuring accessibility for all.",
  },
  {
    icon: ShieldCheck,
    title: "Free & Always Reliable",
    description: "We believe travel info should be free. RailMate is committed to providing essential features at no cost, forever.",
  },
];

export default function WhyRailMate() {
  return (
    <section className="py-24 bg-bg-base">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader 
          title="Why Travelers Choose RailMate"
          subtitle="Built by Bangladeshis, for Bangladeshis. We understand the unique challenges of our railway system."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 mt-16 md:divide-x md:divide-border-strong">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-6 px-6">
              <div className="w-16 h-16 bg-bg-elevated border border-border rounded-2xl flex items-center justify-center text-primary">
                <benefit.icon size={32} weight="duotone" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-jakarta font-bold text-text-primary">
                  {benefit.title}
                </h3>
                <p className="text-text-tertiary text-sm leading-relaxed max-w-xs mx-auto">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
