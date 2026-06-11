import { buildMetadata } from "@/lib/metadata";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata = buildMetadata({
  title: "Copyright & Intellectual Property",
  description: "RailMate Bangladesh Copyright & Intellectual Property notice.",
  path: "/copyright",
});

export default function CopyrightPage() {
  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeader
          title="Copyright & Intellectual Property"
          subtitle="Information about our assets, trademarks, and third-party data."
          centered
        />
        
        <div className="mt-12 space-y-8">
          <section className="bg-bg-elevated p-8 rounded-lg border border-border">
            <p className="text-text-secondary leading-relaxed mb-6">
              The RailMate name, logo, brand assets, app design, code, and all original content are copyright <strong>© 2025 RailMate Bangladesh</strong>. All rights reserved.
            </p>
            
            <p className="text-text-secondary leading-relaxed mb-6">
              Unauthorized copying, reproduction, redistribution, or commercial use of any RailMate asset is strictly prohibited.
            </p>

            <div className="border-t border-border pt-6 mt-6">
              <h3 className="text-lg font-bold text-primary mb-3">Third-Party Trademarks</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Google Play, Apple App Store, Android, and iOS remain the property of their respective owners.
              </p>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <h3 className="text-lg font-bold text-primary mb-3">Data Sources</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Bangladesh Railway schedules and fare data are sourced from Bangladesh Railway's official publications (railway.gov.bd) and are the property of Bangladesh Railway / Government of Bangladesh. Used with attribution for informational purposes only.
              </p>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <h3 className="text-lg font-bold text-primary mb-3">Independence</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                RailMate is an independent platform and is not affiliated with Bangladesh Railway, Shohoz, or any government entity unless officially stated.
              </p>
            </div>

            <div className="border-t border-border pt-6 mt-6 text-center">
              <p className="text-text-secondary font-medium">
                To report a copyright concern, please contact:
              </p>
              <a 
                href="mailto:legal@railmatebd.com" 
                className="text-primary hover:underline font-bold mt-2 inline-block"
              >
                legal@railmatebd.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
