'use client'

import SectionHeader from "@/components/ui/SectionHeader";
import { useI18n } from "@/lib/i18n";
import { Heart, Users, ShieldCheck } from "@phosphor-icons/react";

export default function AboutPageClient() {
  const { t } = useI18n();

  const values = [
    {
      icon: <Heart size={32} />,
      title: t.about.reliability,
      desc: t.about.reliability_desc,
    },
    {
      icon: <Users size={32} />,
      title: t.about.community,
      desc: t.about.community_desc,
    },
    {
      icon: <ShieldCheck size={32} />,
      title: t.about.privacy,
      desc: t.about.privacy_desc,
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
               {t.about.vision}
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
            <h3 className="text-2xl font-jakarta font-extrabold text-text-primary">{t.about.why_exists}</h3>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>{t.about.why_exists_p1}</p>
              <p>{t.about.why_exists_p2}</p>
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
               {t.about.independent_platform}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
