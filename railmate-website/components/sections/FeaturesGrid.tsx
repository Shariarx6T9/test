'use client'

import Badge from '@/components/ui/Badge'
import { ReactNode } from 'react'
import { useI18n } from '@/lib/i18n'
import { 
  Train, 
  CurrencyCircleDollar, 
  UsersThree, 
  BellRinging, 
  WifiSlash, 
  Translate 
} from '@phosphor-icons/react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  body: string
  tag: 'free' | 'pro'
}

export function FeatureCard({ icon, title, body, tag }: FeatureCardProps) {
  return (
    <div className="feature-card bg-bg-elevated border border-border-subtle rounded-2xl p-6 flex flex-col transition-all hover:shadow-lg hover:border-primary/20">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-shrink-0 text-primary">{icon}</div>
        <Badge variant={tag}>{tag.toUpperCase()}</Badge>
      </div>
      <h3 className="text-text-primary font-bold mb-2 text-lg font-jakarta">
        {title}
      </h3>
      <p className="text-text-secondary text-sm font-inter leading-relaxed">
        {body}
      </p>
    </div>
  )
}

export default function FeaturesGrid() {
  const { t } = useI18n()

  const FEATURES: FeatureCardProps[] = [
    {
      icon:  <Train size={32} weight="duotone" />,
      title: t.features_list.train_schedules.title,
      body:  t.features_list.train_schedules.body,
      tag:   'free',
    },
    {
      icon:  <CurrencyCircleDollar size={32} weight="duotone" />,
      title: t.features_list.fare_calculator.title,
      body:  t.features_list.fare_calculator.body,
      tag:   'free',
    },
    {
      icon:  <UsersThree size={32} weight="duotone" />,
      title: t.features_list.live_reports.title,
      body:  t.features_list.live_reports.body,
      tag:   'free',
    },
    {
      icon:  <BellRinging size={32} weight="duotone" />,
      title: t.features_list.alerts.title,
      body:  t.features_list.alerts.body,
      tag:   'pro',
    },
    {
      icon:  <WifiSlash size={32} weight="duotone" />,
      title: t.features_list.offline.title,
      body:  t.features_list.offline.body,
      tag:   'pro',
    },
    {
      icon:  <Translate size={32} weight="duotone" />,
      title: t.features_list.localization.title,
      body:  t.features_list.localization.body,
      tag:   'free',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
      {FEATURES.map((f, i) => (
        <FeatureCard key={i} {...f} />
      ))}
    </div>
  )
}
