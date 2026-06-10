"use client";

import { Calendar, Users, Bell, Bank } from "@phosphor-icons/react";

const features = [
  {
    icon: Calendar,
    name: "Train Schedules",
    description: "Browse full timetables for all Bangladesh Railway routes.",
  },
  {
    icon: Users,
    name: "Community Reports",
    description: "Real-time updates from thousands of fellow travelers.",
  },
  {
    icon: Bell,
    name: "Delay Alerts",
    description: "Get notified immediately about delays on your routes.",
  },
  {
    icon: Bank,
    name: "Fare Lookup",
    description: "Instantly find fares for all classes across any route.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-24 bg-bg-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon size={28} weight="duotone" className="text-primary" />
              </div>
              <h3 className="text-lg font-jakarta font-bold text-text-primary mb-2">
                {feature.name}
              </h3>
              <p className="text-text-tertiary text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
