"use client";

import { Info } from "@phosphor-icons/react";

const stats = [
  { value: "100+", label: "Train Routes Covered" },
  { value: "500+", label: "Stations Searchable" },
  { value: "8", label: "Coach Classes Supported" },
  { value: "Free", label: "Core Features, Always" },
];

export default function StatsSection() {
  return (
    <section className="bg-bg-base py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 text-center divide-y-2 md:divide-y-0 md:divide-x-2 divide-border">
          {stats.map((stat, index) => (
            <div key={index} className="py-8">
              <p className="text-4xl md:text-5xl font-extrabold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto p-4 rounded-md bg-accent/10 border border-accent/20 flex items-start gap-4">
          <Info size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-text-secondary">
            Schedule data is sourced from Bangladesh Railway official publications (railway.gov.bd) and community-verified. Always confirm critical journeys with official sources. Live delay data is community-reported.
          </p>
        </div>
      </div>
    </section>
  );
}
