import SectionHeader from '@/components/ui/SectionHeader'
import FeaturesGrid  from '@/components/sections/FeaturesGrid'

const COPY = {
  overline:  'WHAT RAILMATE DOES',
  headline:  "Everything for your journey. Nothing you don't need.",
}

export default function FeaturesSection() {
  return (
    <section className="bg-[#080D17] py-20" id="features">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <SectionHeader overline={COPY.overline} headline={COPY.headline} />
        </div>
        <FeaturesGrid />
      </div>
    </section>
  )
}
