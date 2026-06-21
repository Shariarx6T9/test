import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

/**
 * Replaces the old dead-end "No trains found" message when a search
 * returns zero direct trains.
 *
 * No transfer-routing engine exists in this codebase (confirmed by audit
 * — searchTrains() returns [] only when no train's origin/destination
 * matches the route at all). This component therefore shows a SUGGESTION
 * to search via a real intercity hub, not an asserted multi-leg itinerary
 * with invented timing. The suggested hub is always a real station from
 * `stations` (passed in via props), never a fabricated one.
 *
 * Priority used here, per spec Step 8:
 *   1. Direct results       — handled by the caller before this renders
 *   2. Existing transfer engine — doesn't exist; skipped
 *   3. Hub-based suggestion — this component's main path
 *   4. (Nearest-station suggestion — not implemented; out of scope for
 *      this targeted change, since it would require new geo/adjacency
 *      logic beyond a minimal fix)
 *   5. True no-route message — shown if no sensible hub differs from
 *      both search endpoints
 */

interface Props {
  locale:       string
  fromCode:     string
  toCode:       string
  fromLabel:    string
  toLabel:      string
  fromDivision: string | null
  toDivision:   string | null
}

const STATION_LABELS: Record<string, string> = {
  DHKA: 'Dhaka', CTG: 'Chittagong', SYT: 'Sylhet', KHU: 'Khulna', RAJ: 'Rajshahi',
  MYM: 'Mymensingh', DNJ: 'Dinajpur', RNG: 'Rangpur', COM: 'Comilla', JMP: 'Jamalpur',
  BOG: 'Bogura', CXBZ: 'Cox\'s Bazar', JS: 'Jessore', SRM: 'Sreemangal', AKH: 'Akhaura',
  BNP: 'Benapole', PCG: 'Panchagarh', IWD: 'Ishwardi', STH: 'Santahar', PBP: 'Parbatipur',
}

// Preferred intercity hubs per Master Reference hub list — all confirmed
// real station codes in the canonical seed (supabase/seed.sql).
const PREFERRED_HUBS = ['DHKA', 'IWD', 'STH', 'PBP', 'RAJ', 'KHU']

function suggestTransferHub(
  fromCode: string,
  toCode:   string,
  fromDivision: string | null,
  toDivision:   string | null
): { hubCode: string; hubLabel: string } | null {
  if (fromCode !== 'DHKA' && toCode !== 'DHKA' && fromDivision !== toDivision) {
    return { hubCode: 'DHKA', hubLabel: STATION_LABELS['DHKA'] }
  }
  const candidate = PREFERRED_HUBS.find((h) => h !== fromCode && h !== toCode)
  if (!candidate) return null
  return { hubCode: candidate, hubLabel: STATION_LABELS[candidate] ?? candidate }
}

export default function NoDirectTrainGuidance({
  locale, fromCode, toCode, fromLabel, toLabel, fromDivision, toDivision,
}: Props) {
  const isBn = locale === 'bn'
  const hub = suggestTransferHub(fromCode, toCode, fromDivision, toDivision)

  // Step 8, condition 5: genuinely no sensible hub — true no-route message.
  if (!hub) {
    return (
      <div className="text-center py-16 bg-bg-elevated rounded-xl border border-border-subtle">
        <p className="text-text-primary font-semibold font-jakarta text-lg mb-2">
          {isBn ? 'কোনো রুট পাওয়া যায়নি' : 'No route available'}
        </p>
        <p className="text-text-secondary font-inter text-sm">
          {isBn
            ? 'এই দুই স্টেশনের মধ্যে কোনো সম্ভাব্য রেল রুট খুঁজে পাওয়া যায়নি।'
            : 'No reasonable railway path could be found between these stations.'}
        </p>
      </div>
    )
  }

  const hubSearchUrl1 = `/${locale}/train/${fromCode.toLowerCase()}-to-${hub.hubCode.toLowerCase()}`
  const hubSearchUrl2 = `/${locale}/train/${hub.hubCode.toLowerCase()}-to-${toCode.toLowerCase()}`

  return (
    <div className="bg-bg-elevated rounded-xl border border-border-subtle p-6 sm:p-8">
      {/* Step 3: replacement title + description, bilingual */}
      <p className="text-text-primary font-bold font-jakarta text-lg mb-1.5">
        {isBn ? 'সরাসরি ট্রেন পাওয়া যায়নি' : 'No Direct Train Available'}
      </p>
      <p className="text-text-secondary font-inter text-sm mb-6">
        {isBn
          ? 'এই দুই স্টেশনের মধ্যে বর্তমানে কোনো সরাসরি ট্রেন পরিচালিত হয় না।'
          : 'No direct train currently operates between these stations.'}
      </p>

      {/* Step 5: hub-based transfer suggestion */}
      <div className="border border-primary/20 bg-primary/5 rounded-lg p-4 sm:p-5 mb-4">
        <p className="text-primary text-xs font-bold uppercase tracking-widest font-inter mb-3">
          {isBn ? 'প্রস্তাবিত ট্রান্সফার রুট' : 'Suggested Transfer Route'}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm font-inter">
          <a
            href={hubSearchUrl1}
            className="flex items-center gap-1.5 text-text-primary font-semibold hover:text-primary transition-colors"
          >
            {fromLabel} <ArrowRight size={14} className="text-text-tertiary" /> {hub.hubLabel}
          </a>
          <span className="text-text-tertiary text-xs">
            {isBn ? `${hub.hubLabel}-এ ট্রান্সফার করুন` : `Transfer at ${hub.hubLabel}`}
          </span>
          <a
            href={hubSearchUrl2}
            className="flex items-center gap-1.5 text-text-primary font-semibold hover:text-primary transition-colors"
          >
            {hub.hubLabel} <ArrowRight size={14} className="text-text-tertiary" /> {toLabel}
          </a>
        </div>

        <p className="text-text-tertiary text-xs font-inter mt-3 leading-relaxed">
          {isBn
            ? 'ট্রান্সফার পরামর্শ উপলব্ধ রেলওয়ে রুট ডেটার উপর ভিত্তি করে এবং সময়সূচী যাচাই করা প্রয়োজন হতে পারে।'
            : 'Transfer guidance is based on available railway route data and may require timetable verification.'}
        </p>
      </div>

      {/* Step 7: honest data notice — visible, not collapsible, inside the guidance block */}
      <div className="border border-accent/20 bg-accent/5 rounded-lg p-3 mb-4">
        <p className="text-text-secondary text-xs font-inter leading-relaxed">
          {isBn
            ? 'সময়সূচির তথ্য আনুমানিক। ভ্রমণের আগে বাংলাদেশ রেলওয়ের অফিসিয়াল তথ্য যাচাই করুন।'
            : 'Schedule information is approximate. Verify departure times through Bangladesh Railway before travel.'}
        </p>
      </div>

      {/* Step 6: app conversion section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-border-subtle">
        <p className="text-text-secondary text-sm font-inter flex-1">
          {isBn
            ? 'সম্পূর্ণ ট্রান্সফার গাইড, যাত্রাপথ পরিকল্পনা, লাইভ যাত্রী রিপোর্ট এবং ভ্রমণ সহায়তা পেতে RailMate অ্যাপ ব্যবহার করুন।'
            : 'Get complete transfer guidance, route planning, live passenger reports, and journey assistance in the RailMate app.'}
        </p>
        <a
          href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ?? '#download'}
          className="flex-shrink-0 inline-flex items-center gap-2 h-11 px-5 bg-primary text-white font-bold font-inter text-sm rounded-md hover:bg-primary-dim transition-colors whitespace-nowrap"
        >
          {isBn ? 'অ্যাপ ডাউনলোড করুন' : 'Download App'}
        </a>
      </div>
    </div>
  )
}
