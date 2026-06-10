"use client";

import Link from 'next/link';

const features = [
  { name: 'Train schedules & fares', free: true, pro: true },
  { name: 'Community reports', free: true, pro: true },
  { name: 'Saved routes', free: '3 max', pro: '∞' },
  { name: 'Departure alerts', free: '1/day', pro: '∞' },
  { name: 'Delay notifications', free: false, pro: true },
  { name: 'Offline schedule access', free: false, pro: true },
  { name: 'Home screen widgets', free: false, pro: true },
  { name: 'Cross-device sync', free: false, pro: true },
  { name: 'Ad-free experience', free: false, pro: true },
];

const FeatureRow = ({ name, free, pro }: { name: string, free: boolean | string, pro: boolean | string }) => {
  const renderValue = (value: boolean | string, isPro: boolean) => {
    if (typeof value === 'boolean') {
      return value ? <span className={isPro ? 'text-accent' : 'text-success'}>✓</span> : <span className="text-text-tertiary">—</span>;
    }
    return <span className={isPro ? 'text-accent font-semibold' : 'text-text-primary'}>{value}</span>;
  };

  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="py-3 px-4 text-sm text-text-secondary">{name}</td>
      <td className="py-3 px-4 text-center">{renderValue(free, false)}</td>
      <td className="py-3 px-4 text-center">{renderValue(pro, true)}</td>
    </tr>
  );
};

export default function PremiumSection() {
  return (
    <section className="bg-bg-elevated py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold">Travel smarter. Upgrade to Pro.</h2>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
          Core features are free forever. Pro unlocks the tools frequent travelers need.
        </p>

        <div className="mt-12 max-w-2xl mx-auto bg-bg-card rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border-strong">
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">Feature</th>
                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-text-tertiary">Free</th>
                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-accent bg-accent/5">Pro</th>
              </tr>
            </thead>
            <tbody>
              {features.map(feature => <FeatureRow key={feature.name} {...feature} />)}
            </tbody>
          </table>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="p-6 rounded-lg border border-border w-full md:w-auto">
            <p className="text-2xl font-bold text-text-primary">৳99 / month</p>
            <p className="text-sm text-text-secondary">Monthly Plan</p>
          </div>
          <div className="relative p-6 rounded-lg border-2 border-accent bg-accent/5 w-full md:w-auto">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="text-xs uppercase font-bold text-accent bg-bg-elevated px-3 py-1 border-2 border-accent rounded-full">Most Popular</div>
            </div>
            <p className="text-2xl font-bold text-accent">৳799 / year</p>
            <p className="text-sm text-accent">Best Value · Save 33%</p>
          </div>
        </div>
        
        <p className="mt-4 text-sm text-text-tertiary">
            7-day free trial · Cancel anytime · No commitment
        </p>

        <div className="mt-8">
            <Link href="#download" className="inline-block bg-primary text-text-inverse font-bold text-lg px-8 py-4 rounded-md hover:bg-primary-dim transition-colors">
                Start Free Trial →
            </Link>
        </div>

      </div>
    </section>
  );
}
