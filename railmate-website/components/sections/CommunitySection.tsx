"use client";

import { Users, Warning, Clock, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Button from "../ui/Button";
import { useI18n } from "@/lib/i18n";

export default function CommunitySection() {
  const { t } = useI18n();

  const reports = [
    {
      id: 1,
      type: "delay",
      status: "🔴 Delay",
      title: "Subarna Express",
      time: "Reported 3 min ago",
      count: "12 confirmed",
      color: "text-danger",
      bgColor: "bg-danger/10",
      borderColor: "border-danger/20",
    },
    {
      id: 2,
      type: "crowding",
      status: "🟡 Crowding",
      title: "Dhaka to Chittagong",
      time: "Standing room only",
      count: "8 confirmed",
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    },
    {
      id: 3,
      type: "on-time",
      status: "🟢 On Time",
      title: "Sonar Bangla Express",
      time: "Running as scheduled",
      count: "25 confirmed",
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
    },
  ];

  return (
    <section className="py-24 bg-bg-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="bg-bg-elevated rounded-xl border border-border p-8 lg:p-16 relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full -mr-48 -mt-48" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                <Users weight="bold" />
                {t.community_section.badge}
              </div>
              
              <div className="space-y-4">
                <h2
                  className="text-4xl lg:text-5xl font-jakarta font-extrabold text-text-primary"
                  dangerouslySetInnerHTML={{ __html: t.community_section.headline }}
                />
                <p className="text-text-secondary text-lg leading-relaxed max-w-xl">
                  {t.community_section.subheadline}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                 <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-md bg-bg-card border border-border flex items-center justify-center flex-shrink-0">
                       <Warning className="text-accent" size={24} />
                    </div>
                    <div>
                       <h4 className="text-text-primary font-bold">{t.community_section.delay_reporting_title}</h4>
                       <p className="text-text-tertiary text-sm">{t.community_section.delay_reporting_desc}</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-md bg-bg-card border border-border flex items-center justify-center flex-shrink-0">
                       <Users className="text-primary" size={24} />
                    </div>
                    <div>
                       <h4 className="text-text-primary font-bold">{t.community_section.crowd_status_title}</h4>
                       <p className="text-text-tertiary text-sm">{t.community_section.crowd_status_desc}</p>
                    </div>
                 </div>
              </div>

              <Button size="lg">{t.community_section.cta}</Button>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div 
                  key={report.id}
                  className="p-6 bg-bg-card border border-border rounded-lg hover:border-border-strong transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${report.bgColor} ${report.color} border ${report.borderColor}`}>
                      {report.status}
                    </span>
                    <span className="text-text-tertiary text-xs flex items-center gap-1">
                       <Clock size={14} />
                       {report.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-text-primary">{report.title}</h3>
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                       <CheckCircle size={18} className="text-success" />
                       {report.count}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Decorative Card Offset */}
              <div className="p-4 bg-bg-card/50 border border-border/50 rounded-lg blur-[1px] scale-95 origin-top opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
