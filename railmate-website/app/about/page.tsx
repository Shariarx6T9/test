import { buildMetadata } from "@/lib/metadata";
import SectionHeader from "@/components/ui/SectionHeader";
import { Heart, Users, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

export const metadata = buildMetadata({
  title: "About RailMate Bangladesh",
  description: "Learn about RailMate Bangladesh — our mission to simplify train travel for every Bangladeshi traveler.",
  path: "/about",
});

export default function AboutPage() {
  const values = [
    {
      icon: <Heart size={32} />,
      title: "Reliability",
      desc: "We strive to provide the most accurate and up-to-date information possible through official data and community verification.",
    },
    {
      icon: <Users size={32} />,
      title: "Community",
      desc: "RailMate is built for travelers, by travelers. We believe in the power of shared information to improve everyone's journey.",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Privacy",
      desc: "Your data is yours. We collect only what's necessary to provide our service and never compromise your personal information.",
    },
  ];

  return (
    <main className="pt-32 pb-24 bg-bg-base min-h-screen">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <SectionHeader 
            title="About RailMate Bangladesh"
            align="left"
          />
        </div>

        <div className="space-y-16">
          {/* Vision Block */}
          <div className="p-8 lg:p-12 bg-primary/10 border border-primary/20 rounded-radius-xl">
             <h2 className="text-2xl lg:text-3xl font-jakarta font-extrabold text-primary leading-tight">
               "RailMate Bangladesh is the most trusted railway companion app for Bangladeshi travelers — the app they open before, during, and after every train journey."
             </h2>
          </div>

          {/* Mission Paragraph */}
          <div className="space-y-6">
            <h3 className="text-2xl font-jakarta font-extrabold text-text-primary">Our Mission</h3>
            <p className="text-text-secondary text-lg leading-relaxed">
              To simplify and improve the Bangladesh Railway experience through unified, intelligent, community-powered tools — without replacing existing government services. We aim to be the digital bridge that connects travelers with the information they need most.
            </p>
          </div>

          {/* Why RailMate Exists */}
          <div className="space-y-6">
            <h3 className="text-2xl font-jakarta font-extrabold text-text-primary">Why RailMate Exists</h3>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                For years, Bangladeshi train travelers have navigated a fragmented landscape of information. Official schedules were often hard to find on mobile, real-time delay information was non-existent except at station platforms, and there was no unified way for passengers to help each other.
              </p>
              <p>
                Existing apps often lacked a modern user experience, didn't support iOS, or didn't provide a community layer that reflected the real-time reality of the tracks. We saw a need for a new standard — a companion that feels like it belongs in 2025.
              </p>
              <p>
                RailMate was born out of this frustration. We wanted to build something that we, as travelers, would want to use every day. Something fast, beautiful, and powered by the people who actually ride the trains.
              </p>
            </div>
          </div>

          {/* Brand Positioning */}
          <div className="p-8 bg-bg-elevated border border-border rounded-radius-xl space-y-4">
             <h4 className="text-sm uppercase tracking-widest font-bold text-text-tertiary">Our Positioning</h4>
             <p className="text-text-primary text-xl font-medium leading-relaxed italic">
               "FOR students, commuters, and business travelers WHO are frustrated by fragmented railway information, RAILMATE is a unified companion THAT provides schedules, fares, community alerts, and journey intelligence — UNLIKE anything currently available in Bangladesh."
             </p>
          </div>

          {/* Our Values */}
          <div className="space-y-8">
            <h3 className="text-2xl font-jakarta font-extrabold text-text-primary text-center">Our Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, i) => (
                <div key={i} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-bg-card border border-border rounded-full flex items-center justify-center mx-auto text-primary">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-bold text-text-primary">{value.title}</h4>
                  <p className="text-text-tertiary text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Commitment to Bangladesh */}
          <div className="space-y-6">
            <h3 className="text-2xl font-jakarta font-extrabold text-text-primary">Commitment to Bangladesh</h3>
            <p className="text-text-secondary leading-relaxed">
              We are building for the real-world connectivity constraints of Bangladesh. Our app is offline-first for schedules, lightweight for low-end devices, and puts Bengali language support at the forefront. We believe technology should serve everyone, regardless of their device or location.
            </p>
          </div>

          {/* Independence Disclaimer */}
          <div className="pt-8 border-t border-border">
            <div className="p-6 bg-bg-card border border-border rounded-radius-lg">
              <p className="text-text-tertiary text-sm leading-relaxed">
                <strong>Independence Disclaimer:</strong> RailMate is an independent platform developed by Bangladeshi developers. It is not affiliated with, endorsed by, or officially connected to Bangladesh Railway unless explicitly stated. All trademarked names and logos are the property of their respective owners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
