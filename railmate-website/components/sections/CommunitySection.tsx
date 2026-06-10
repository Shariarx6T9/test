"use client";

import { CheckCircle } from "@phosphor-icons/react";

const reports = [
  {
    type: "DELAY",
    train: "Subarna Express #721",
    details: "Delayed 20 min at Comilla · Reported 3 min ago",
    confirmations: "12 travelers confirmed this",
    color: "danger",
    icon: "⚠️",
  },
  {
    type: "CROWDING",
    train: "Turna Express · Dhaka-bound",
    details: "Very High · Coach 3–5 overcrowded",
    confirmations: "8 confirmed",
    color: "accent",
    icon: "🟡",
  },
  {
    type: "ON TIME",
    train: "Sonar Bangla Express #787",
    details: "Running on schedule · 25 confirmations",
    confirmations: null,
    color: "success",
    icon: "✅",
  },
];

const ReportCard = ({ report, delay }: { report: (typeof reports)[0], delay: string }) => (
  <div
    className={`bg-bg-card p-4 rounded-lg border-l-4 ${'border-' + report.color} opacity-0 animate-fade-in-up`}
    style={{ animationDelay: delay }}
  >
    <div className={`inline-flex items-center gap-2 text-sm font-bold text-${report.color}`}>
      {report.icon} {report.type}
    </div>
    <h4 className="font-semibold text-text-primary mt-2">{report.train}</h4>
    <p className="text-sm text-text-secondary mt-1">{report.details}</p>
    {report.confirmations && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-success">
            <CheckCircle size={16} weight="bold" />
            <span>{report.confirmations}</span>
        </div>
    )}
  </div>
);


export default function CommunitySection() {
  return (
    <section className="bg-bg-elevated py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-wider">
                Community Intelligence
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-text-primary">
                Real Reports. Real Travelers.
              </h2>
            </div>
            <div className="space-y-4 text-text-secondary text-base leading-relaxed">
              <p>
                No government API. No paid data feed. Just thousands of Bangladeshi train passengers telling each other what's actually happening right now.
              </p>
              <p>
                When Subarna Express leaves Comilla 20 minutes late, someone on that train reports it. Within seconds, everyone waiting at Chittagong knows.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-8 pt-4">
              <div>
                <p className="text-4xl font-extrabold text-primary">8 travelers</p>
                <p className="text-sm text-text-secondary mt-1">confirmed a delay this morning</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-primary">&lt; 3 min</p>
                <p className="text-sm text-text-secondary mt-1">average time from event to report</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-primary">Free</p>
                <p className="text-sm text-text-secondary mt-1">community features cost nothing</p>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="max-w-sm mx-auto space-y-4">
            {reports.map((report, i) => (
              <ReportCard key={i} report={report} delay={`${i * 200}ms`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
