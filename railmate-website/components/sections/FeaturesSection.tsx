'use client'

import SectionHeader from '@/components/ui/SectionHeader'
import FeaturesGrid  from '@/components/sections/FeaturesGrid'
import { useI18n } from '@/lib/i18n'

export default function FeaturesSection() {
  const { t } = useI18n()

  return (
    <section className="bg-bg-base py-20" id="features">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <SectionHeader 
            overline={t.sections.features.overline} 
            headline={t.sections.features.title} 
            subheadline={t.sections.features.subtitle}
          />
        </div>
        <FeaturesGrid />
      </div>
    </section>
  )
}
