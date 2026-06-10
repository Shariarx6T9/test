"use client";

import { CheckCircle, Globe, WifiSlash, ShieldCheck, ArrowsCounterClockwise, Users } from "@phosphor-icons/react/dist/ssr";

export default function UserBenefits() {
  const benefits = [
    { icon: <Globe size={24} />, title: "Bengali & English", desc: "Native support for both languages across the entire app." },
    { icon: <WifiSlash size={24} />, title: "Works Offline", desc: "Access full train schedules even without an internet connection." },
    { icon: <CheckCircle size={24} />, title: "Free to Use", desc: "Core features like schedules and fares are free forever." },
    { icon: <Users size={24} />, title: "Community Verified", desc: "Reports are validated by other travelers in real-time." },
    { icon: <ArrowsCounterClockwise size={24} />, title: "Regular Updates", desc: "Timetables and features updated frequently." },
    { icon: <ShieldCheck size={24} />, title: "Privacy First", desc: "We collect minimal data and never sell your personal info." },
  ];

  const stats = [
    { label: "Train Routes", value: "10+" },
    { label: "Stations", value: "100+" },
    { label: "Powered By", value: "Community" },
    { label: "Core App", value: "Free Forever" },
  ];

  return (
    <section className="py-24 bg-base">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Column: Benefits */}
          <div className="space-y-12">
            <h2 className="text-4xl lg:text-5xl font-jakarta font-extrabold text-text-primary">
              Built for the <br />
              <span className="text-primary">Bangladeshi Traveler</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="space-y-3">
                  <div className="text-primary">{benefit.icon}</div>
                  <h4 className="text-text-primary font-bold text-lg">{benefit.title}</h4>
                  <p className="text-text-tertiary text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="grid grid-cols-2 gap-4">
             {stats.map((stat, i) => (
               <div key={i} className="p-8 bg-bg-elevated border border-border rounded-radius-xl flex flex-col items-center justify-center text-center space-y-2">
                  <p className="text-text-tertiary text-xs uppercase tracking-widest font-bold">{stat.label}</p>
                  <p className="text-text-primary font-jakarta font-extrabold text-3xl">{stat.value}</p>
               </div>
             ))}
             
             {/* Large Callout */}
             <div className="col-span-2 mt-4 p-8 bg-primary/10 border border-primary/20 rounded-radius-xl text-center">
                <p className="text-primary font-bold">Trusted by thousands of passengers every day.</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
