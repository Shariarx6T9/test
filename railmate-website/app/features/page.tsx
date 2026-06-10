import { buildMetadata } from "@/lib/metadata";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import { 
  Calendar, 
  CurrencyCircleDollar, 
  BookmarkSimple, 
  MapTrifold, 
  Users, 
  UserList, 
  BellRinging, 
  Toilet, 
  Buildings, 
  Crown 
} from "@phosphor-icons/react";

export const metadata = buildMetadata({
  title: "Features",
  description: "Explore all RailMate features: train schedules, fare lookup, community reports, delay alerts, saved routes, and more.",
  path: "/features",
});

const features = [
  {
    icon: <Calendar size={32} />,
    name: "Train Schedules",
    desc: "Browse full Bangladesh Railway timetable by route or station. Search by departure, arrival, or train name. Bilingual display ensures accessibility for everyone.",
    phase: 1,
  },
  {
    icon: <CurrencyCircleDollar size={32} />,
    name: "Fare Lookup",
    desc: "View fare matrix across all 8 seat classes (Shovon, Shovon Chair, Snigdha, AC Berth, AC Seat, First Berth, First Seat, AC S Chair). No more surprises at the counter.",
    phase: 1,
  },
  {
    icon: <BookmarkSimple size={32} />,
    name: "Saved Routes",
    desc: "Bookmark your most-used routes for one-tap access. Your daily commute info is always just a second away, even on the go.",
    phase: 1,
  },
  {
    icon: <MapTrifold size={32} />,
    name: "Journey Planning",
    desc: "Plan multi-leg journeys with transfer suggestions. Find the most efficient way to reach your destination with smart connection logic.",
    phase: 2,
  },
  {
    icon: <Users size={32} />,
    name: "Community Delay Reports",
    desc: "Real-time user-submitted delay reports. Upvote system ensures reliability and accuracy through collective intelligence from fellow passengers.",
    phase: 1,
  },
  {
    icon: <UserList size={32} />,
    name: "Crowding Reports",
    desc: "Know how packed your train is before boarding. Community-shared data helps you decide whether to wait for the next one or find a better coach.",
    phase: 1,
  },
  {
    icon: <BellRinging size={32} />,
    name: "Delay Notifications & Alerts",
    desc: "Get push alerts for your saved routes. Powered by community reports, these alerts keep you informed about delays before you leave home.",
    phase: 2,
  },
  {
    icon: <Toilet size={32} />,
    name: "Train Condition Reports",
    desc: "Cleanliness, AC status, toilet status — community reported. Choose the best trains based on recent passenger experiences.",
    phase: 2,
  },
  {
    icon: <Buildings size={32} />,
    name: "Station Info",
    desc: "Platform numbers, facilities, nearby transport links. Navigate complex stations like a pro with detailed local information.",
    phase: 2,
  },
  {
    icon: <Crown size={32} />,
    name: "Premium Features (RailMate+)",
    desc: "Offline maps, priority alerts, ad-free experience, and advanced journey analytics. Support the mission while getting the ultimate companion experience.",
    phase: 3,
  },
];

export default function FeaturesPage() {
  return (
    <main className="pt-32 pb-24 bg-base min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-20">
          <SectionHeader 
            title="Every Feature You Need for Better Train Travel"
            align="left"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="p-8 bg-bg-elevated border border-border rounded-radius-xl hover:border-border-strong transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-bg-card border border-border rounded-radius-lg text-primary group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                {feature.phase === 1 ? (
                  <Badge variant="success">Available Now</Badge>
                ) : feature.phase === 2 ? (
                  <Badge variant="warning">Coming Soon</Badge>
                ) : (
                  <Badge variant="warning">Future Update</Badge>
                )}
              </div>
              
              <h3 className="text-2xl font-jakarta font-extrabold text-text-primary mb-4">
                {feature.name}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
