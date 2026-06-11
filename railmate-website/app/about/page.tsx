'use client'

import SectionHeader from "@/components/ui/SectionHeader";
import { useI18n } from "@/lib/i18n";
import { Heart, Users, ShieldCheck } from "@phosphor-icons/react";

export default function AboutPage() {
  const { t } = useI18n();

  const values = [
    {
      icon: <Heart size={32} />,
      title: t.about.reliability,
      desc: "We strive to provide the most accurate and up-to-date information possible through official data and community verification.",
    },
    {
      icon: <Users size={32} />,
      title: t.about.community,
      desc: "RailMate is built for travelers, by travelers. We believe in the power of shared information to improve everyone's journey.",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: t.about.privacy,
      desc: "Your data is yours. We collect only what's necessary to provide our service and never compromise your personal information.",
    },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <SectionHeader 
            title={t.about.title}
            align="left"
          />
        </div>

        <div className="space-y-16">
          {/* Vision Block */}
          <div className="p-8 lg:p-12 bg-primary/5 border border-primary/20 rounded-xl">
             <h2 className="text-2xl lg:text-3xl font-jakarta font-extrabold text-primary leading-tight">
               "RailMate Bangladesh is the most trusted railway companion app for Bangladeshi travelers — the app they open before, during, and after every train journey."
             </h2>
          </div>

          {/* Mission Paragraph */}
          <div className="space-y-6">
            <h3 className="text-2xl font-jakarta font-extrabold text-text-primary">{t.about.mission}</h3>
            <p className="text-text-secondary text-lg leading-relaxed font-inter">
              {t.about.mission_desc}
            </p>
          </div>

          {/* Why RailMate Exists */}
          <div className="space-y-6 font-inter">
            <h3 className="text-2xl font-jakarta font-extrabold text-text-primary">Why RailMate Exists</h3>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                For years, Bangladeshi train travelers have navigated a fragmented landscape of information. Official schedules were often hard to find on mobile, real-time delay information was non-existent except at station platforms, and there was no unified way for passengers to help each other.
              </p>
              <p>
                Existing apps often lacked a modern user experience, didn't support iOS, or didn't provide a community layer that reflected the real-time reality of the tracks. We saw a need for a new standard — a companion that feels like it belongs in 2025.
              </p>
            </div>
          </div>

          {/* Our Values */}
          <div className="space-y-8">
            <h3 className="text-2xl font-jakarta font-extrabold text-text-primary text-center font-inter">{t.about.values}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, i) => (
                <div key={i} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-bg-card border border-border-subtle rounded-full flex items-center justify-center mx-auto text-primary">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-bold text-text-primary font-inter">{value.title}</h4>
                  <p className="text-text-tertiary text-sm leading-relaxed font-inter">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-8 border-t border-border-subtle text-center">
             <p className="text-text-tertiary text-sm max-w-2xl mx-auto italic font-inter">
               RailMate is an independent platform developed by Bangladeshi developers. It is not affiliated with Bangladesh Railway.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
