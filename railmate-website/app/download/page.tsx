import { buildMetadata } from "@/lib/metadata";
import SectionHeader from "@/components/ui/SectionHeader";
import DownloadButton from "@/components/ui/DownloadButton";
import Badge from "@/components/ui/Badge";
import { 
  GooglePlayLogo, 
  AndroidLogo, 
  AppleLogo, 
  DownloadSimple, 
  Gear, 
  CheckCircle,
  FileArrowDown
} from "@phosphor-icons/react/dist/ssr";

export const metadata = buildMetadata({
  title: "Download RailMate Bangladesh",
  description: "Download RailMate Bangladesh on Android. Available on Google Play and as a direct APK. iOS coming soon.",
  path: "/download",
});

export default function DownloadPage() {
  const steps = [
    {
      title: "Google Play",
      steps: [
        { icon: <DownloadSimple />, text: "Tap 'Download on Google Play' below" },
        { icon: <CheckCircle />, text: "Open the app after installation" },
        { icon: <Gear />, text: "Allow location permission (optional)" },
      ],
    },
    {
      title: "Direct APK",
      steps: [
        { icon: <FileArrowDown />, text: "Download the APK file to your device" },
        { icon: <Gear />, text: "Enable 'Install from unknown sources' in Settings" },
        { icon: <DownloadSimple />, text: "Tap the APK file to begin installation" },
        { icon: <CheckCircle />, text: "Done! Open RailMate from your app drawer" },
      ],
    },
  ];

  return (
    <main className="pt-32 pb-24 bg-bg-base min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            "name": "RailMate Bangladesh",
            "operatingSystem": "Android",
            "applicationCategory": "TravelApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "BDT"
            },
            "description": "Bangladesh's most trusted railway companion app.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "0"
            }
          }),
        }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-20 text-center">
          <SectionHeader 
            title="Get RailMate on Your Device"
            align="center"
          />
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
             The most trusted railway companion for Bangladesh is available now on Android. iOS version is currently in development.
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {/* Google Play */}
          <div className="p-8 bg-bg-elevated border border-border rounded-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-bg-card border border-border rounded-full flex items-center justify-center mb-6 text-primary">
              <GooglePlayLogo size={32} weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Google Play</h3>
            <p className="text-text-tertiary text-sm mb-8">Official Store — Recommended for auto-updates and security.</p>
            <div className="mt-auto w-full">
              <DownloadButton platform="google-play" className="w-full" />
            </div>
          </div>

          {/* APK */}
          <div className="p-8 bg-bg-elevated border border-border rounded-xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-bg-card border border-border rounded-full flex items-center justify-center mb-6 text-text-primary">
              <AndroidLogo size={32} weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Direct APK</h3>
            <p className="text-text-tertiary text-sm mb-4">Manual installation. Version: v1.0.0 (Coming Soon)</p>
            <div className="p-3 bg-bg-card border border-border rounded-md w-full mb-8">
               <p className="text-[10px] text-text-tertiary font-mono break-all">SHA256: 7f83b...placeholder</p>
            </div>
            <div className="mt-auto w-full">
              <DownloadButton platform="apk" className="w-full" />
            </div>
          </div>

          {/* App Store */}
          <div className="p-8 bg-bg-elevated border border-border rounded-xl flex flex-col items-center text-center opacity-75">
            <div className="w-16 h-16 bg-bg-card border border-border rounded-full flex items-center justify-center mb-6 text-text-secondary">
              <AppleLogo size={32} weight="bold" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">App Store</h3>
            <p className="text-text-tertiary text-sm mb-2">Coming to iOS in Late 2025.</p>
            <Badge variant="warning" className="mb-8">Coming Soon</Badge>
            <div className="mt-auto w-full">
              <DownloadButton platform="app-store" status="coming-soon" className="w-full" />
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {steps.map((section, i) => (
            <div key={i} className="space-y-8">
               <h3 className="text-2xl font-jakarta font-extrabold text-text-primary">{section.title} Instructions</h3>
               <div className="space-y-4">
                  {section.steps.map((step, si) => (
                    <div key={si} className="flex gap-4 p-4 bg-bg-card border border-border rounded-lg">
                       <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                          {step.icon}
                       </div>
                       <div>
                          <p className="text-text-tertiary text-xs font-bold uppercase mb-1">Step {si + 1}</p>
                          <p className="text-text-primary font-medium">{step.text}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>

        {/* Version & Release Notes */}
        <div className="space-y-8 mb-24">
           <h3 className="text-2xl font-jakarta font-extrabold text-text-primary">Version & Release Notes</h3>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-border">
                       <th className="py-4 px-6 text-text-tertiary font-bold text-sm uppercase">Version</th>
                       <th className="py-4 px-6 text-text-tertiary font-bold text-sm uppercase">Release Date</th>
                       <th className="py-4 px-6 text-text-tertiary font-bold text-sm uppercase">Changes</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr className="border-b border-border bg-bg-elevated/30">
                       <td className="py-4 px-6 font-mono text-primary">v1.0.0</td>
                       <td className="py-4 px-6 text-text-secondary">Coming Soon</td>
                       <td className="py-4 px-6 text-text-secondary">Initial public release featuring schedules, fares, and community reporting.</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>

        {/* System Requirements */}
        <div className="p-8 bg-bg-elevated border border-border rounded-xl">
           <h3 className="text-xl font-jakarta font-extrabold text-text-primary mb-6">System Requirements</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                 <p className="text-text-tertiary text-xs font-bold uppercase mb-2">Android</p>
                 <p className="text-text-primary">7.0+ (API 24+)</p>
              </div>
              <div>
                 <p className="text-text-tertiary text-xs font-bold uppercase mb-2">iOS</p>
                 <p className="text-text-primary">15.0+ (Coming Soon)</p>
              </div>
              <div>
                 <p className="text-text-tertiary text-xs font-bold uppercase mb-2">Storage</p>
                 <p className="text-text-primary">~25 MB</p>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
