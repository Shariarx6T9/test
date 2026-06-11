import Badge from '@/components/ui/Badge'
import { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  body: string
  tag: 'free' | 'pro'
}

export function FeatureCard({ icon, title, body, tag }: FeatureCardProps) {
  return (
    <div className="feature-card bg-[#162035] border border-[#1E2E42] rounded-2xl p-6 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-shrink-0">{icon}</div>
        <Badge variant={tag}>{tag.toUpperCase()}</Badge>
      </div>
      <h3
        className="text-[#F0F4FF] font-bold mb-2"
        style={{ fontSize: '16px', fontFamily: 'var(--font-jakarta)' }}
      >
        {title}
      </h3>
      <p
        className="text-[#8FA3C0]"
        style={{ fontSize: '14px', fontFamily: 'var(--font-inter)', lineHeight: '1.65' }}
      >
        {body}
      </p>
    </div>
  )
}

/* ── Icons ────────────────────────────────────────────────────── */
function TrainIcon()     { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden><rect x="2" y="7" width="20" height="13" rx="2" stroke="#00A859" strokeWidth="1.5"/><path d="M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" stroke="#00A859" strokeWidth="1.5"/><path d="M8 14.5h8M6 11.5h2M16 11.5h2" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="17" r="1" fill="#00A859"/><circle cx="16" cy="17" r="1" fill="#00A859"/></svg> }
function FareIcon()      { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="9" stroke="#00A859" strokeWidth="1.5"/><text x="12" y="17" textAnchor="middle" fill="#00A859" fontSize="12" fontWeight="700" fontFamily="serif">৳</text></svg> }
function CommunityIcon() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="9" cy="8" r="3" stroke="#F5A623" strokeWidth="1.5"/><circle cx="15" cy="8" r="3" stroke="#F5A623" strokeWidth="1.5"/><path d="M3 20c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function BellIcon()      { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 10a7 7 0 0114 0v4l2 2H3l2-2v-4z" stroke="#00A859" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 18a2 2 0 004 0" stroke="#00A859" strokeWidth="1.5"/></svg> }
function OfflineIcon()   { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="2" y1="2" x2="22" y2="22" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round"/></svg> }
function LangIcon()      { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="9" stroke="#00A859" strokeWidth="1.5"/><path d="M12 3c0 0-2 3-2 9s2 9 2 9M3 12h18" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round"/><path d="M4.5 8.5c2 1 5 1.5 7.5 1.5s5.5-.5 7.5-1.5M4.5 15.5c2-1 5-1.5 7.5-1.5s5.5.5 7.5 1.5" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round"/></svg> }

const FEATURES: FeatureCardProps[] = [
  {
    icon:  <TrainIcon />,
    title: 'Train Schedules',
    body:  'Full timetables for all Bangladesh Railway intercity routes. Updated when BR updates. Always with last-verified date shown.',
    tag:   'free',
  },
  {
    icon:  <FareIcon />,
    title: 'Fare Calculator',
    body:  'Exact fares for all 8 coach classes — Shovon to AC Berth. Pick your route, pick your class. No more PDF digging.',
    tag:   'free',
  },
  {
    icon:  <CommunityIcon />,
    title: 'Live Delay Reports',
    body:  "Fellow travelers report delays, crowding, and coach conditions in real time. Know what's happening before you leave home.",
    tag:   'free',
  },
  {
    icon:  <BellIcon />,
    title: 'Departure Alerts',
    body:  'Get a push notification before your train departs. Never miss your Dhaka–Chittagong express again.',
    tag:   'pro',
  },
  {
    icon:  <OfflineIcon />,
    title: 'Offline Access',
    body:  'Full schedule data cached on your device. Works in stations with no signal. Works on overnight journeys with no data.',
    tag:   'pro',
  },
  {
    icon:  <LangIcon />,
    title: 'Bengali & English',
    body:  'Station names, train names, all UI in both languages. Switch any time. Noto Sans Bengali for proper rendering.',
    tag:   'free',
  },
]

export default function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1100px] mx-auto">
      {FEATURES.map((f) => (
        <FeatureCard key={f.title} {...f} />
      ))}
    </div>
  )
}
