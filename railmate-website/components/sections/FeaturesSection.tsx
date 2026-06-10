"use client";

import type { ComponentType, ElementType } from "react";

import {
  Train,
  UsersThree,
  BellSimple,
  WifiSlash,
  Translate,
  type IconProps,
} from "@phosphor-icons/react";

interface Feature {
  icon: ElementType<IconProps>;
  title: string;
  body: string;
  tag: "FREE" | "PRO";
}

const TakaIcon: ComponentType<IconProps> = ({
  size = 24,
  className,
}) => (
  <span
    aria-hidden="true"
    className={className}
    style={{ fontSize: size, lineHeight: 1 }}
  >
    ৳
  </span>
);

const features: Feature[] = [
  {
    icon: Train,
    title: "Train Schedules",
    body: "Full timetables for all Bangladesh Railway intercity routes. Updated when BR updates. Always with last-verified date shown.",
    tag: "FREE",
  },
  {
    icon: TakaIcon,
    title: "Fare Calculator",
    body: "Exact fares for all 8 coach classes — Shovon to AC Berth. Pick your route, pick your class. No more PDF digging.",
    tag: "FREE",
  },
  {
    icon: UsersThree,
    title: "Live Delay Reports",
    body: "Fellow travelers report delays, crowding, and coach conditions in real time. Know what's happening before you leave home.",
    tag: "FREE",
  },
  {
    icon: BellSimple,
    title: "Departure Alerts",
    body: "Get a push notification before your train departs. Never miss your Dhaka–Chittagong express again.",
    tag: "PRO",
  },
  {
    icon: WifiSlash,
    title: "Offline Access",
    body: "Full schedule data cached on your device. Works in stations with no signal. Works on overnight journeys with no data.",
    tag: "PRO",
  },
  {
    icon: Translate,
    title: "Bengali & English",
    body: "Station names, train names, all UI in both languages. Switch any time. Noto Sans Bengali for proper rendering.",
    tag: "FREE",
  },
];

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon;
  const isPro = feature.tag === "PRO";
  
  return (
    <div className="bg-bg-card border border-border rounded-lg p-6 hover:border-border-strong hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPro ? 'bg-accent/10' : 'bg-primary/10'}`}>
          <Icon size={24} className={isPro ? "text-accent" : "text-primary"} />
        </div>
        <div
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            isPro
              ? "bg-accent/10 text-accent"
              : "bg-primary-subtle text-primary"
          }`}
        >
          {feature.tag}
        </div>
      </div>
      <h3 className="text-lg font-bold mt-4">{feature.title}</h3>
      <p className="text-text-secondary text-sm mt-1">{feature.body}</p>
    </div>
  );
};

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-bg-base py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider">
            What Railmate Does
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-text-primary max-w-3xl mx-auto">
            Everything for your journey. Nothing you don't need.
          </h2>
        </div>

        <div className="mt-12 max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
