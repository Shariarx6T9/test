"use client";

import { Warning, AppWindow, CurrencyBdt } from "@phosphor-icons/react";

const painPoints = [
  {
    icon: Warning,
    title: "Is my train even on time?",
    body: "You leave home, reach the station, and only then find out your train is delayed 45 minutes. No app warned you. No one knew.",
    color: "danger",
  },
  {
    icon: AppWindow,
    title: "3 apps for 1 journey",
    body: "BR website for schedules. Shohoz for tickets. WhatsApp groups for delay news. There's no single place that does everything.",
    color: "accent",
  },
  {
    icon: CurrencyBdt,
    title: "What does this ticket actually cost?",
    body: "Fare tables are buried in PDFs. Prices differ by class, season, and nobody tells you that Snigdha isn't available on this route.",
    color: "info",
  },
];

const colorClasses = {
  danger: {
    icon: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/20",
  },
  accent: {
    icon: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  info: {
    icon: "text-info",
    bg: "bg-info/10",
    border: "border-info/20",
  },
};

const PainPointCard = ({ point }: { point: (typeof painPoints)[0] }) => {
  const Icon = point.icon;
  const colors = colorClasses[point.color as keyof typeof colorClasses];
  
  return (
    <div className={`p-6 rounded-lg border ${colors.bg} ${colors.border}`}>
      <Icon size={32} className={colors.icon} />
      <h3 className="text-xl font-bold mt-4">{point.title}</h3>
      <p className="text-text-secondary mt-2">{point.body}</p>
    </div>
  );
};


export default function ProblemSection() {
  return (
    <section className="bg-bg-elevated py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-text-primary">
          Sound familiar?
        </h2>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
          Every Bangladesh train traveler knows these problems.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {painPoints.map((point) => (
            <PainPointCard key={point.title} point={point} />
          ))}
        </div>

        <p className="mt-12 text-xl font-bold text-primary">
          RailMate fixes all three. For free.
        </p>
      </div>
    </section>
  );
}
