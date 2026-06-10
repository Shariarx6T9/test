import { buildMetadata } from "@/lib/metadata";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "RailMate Bangladesh Terms & Conditions. Learn about the terms of using our service.",
  path: "/terms",
});

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using RailMate Bangladesh, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our service.",
    },
    {
      title: "2. Service Description",
      content: "RailMate Bangladesh is an informational and companion platform for train travelers. We provide schedules, fares, and community-driven reports. We are NOT a ticketing platform and do not sell train tickets directly.",
    },
    {
      title: "3. User Responsibilities",
      content: "Users are responsible for providing accurate community reports and maintaining the integrity of the platform. Any form of abuse, harassment, or submission of false information is strictly prohibited. You must not use automated systems to access our data.",
    },
    {
      title: "4. Community Reporting Guidelines",
      content: "When submitting reports (delays, crowding, etc.), you must provide honest, real-time data. Fake reports, misleading information, or spamming will lead to account suspension or a permanent ban.",
    },
    {
      title: "5. Acceptable Use Policy",
      content: "You agree not to scrape, reverse engineer, or abuse our APIs. Our data is provided for personal, non-commercial use only.",
    },
    {
      title: "6. Intellectual Property Ownership",
      content: "All RailMate assets, including the name, logo, app design, and original code, belong to RailMate Bangladesh. Unauthorized use of these assets is prohibited.",
    },
    {
      title: "7. Schedule Data Disclaimer",
      content: "Information is sourced from Bangladesh Railway official publications. RailMate makes no guarantee of real-time accuracy. Always verify with official Bangladesh Railway sources for critical travel planning.",
    },
    {
      title: "8. Community Content",
      content: "User-submitted reports are the responsibility of the user. While we moderate content, we do not guarantee the absolute accuracy of every community report.",
    },
    {
      title: "9. Limitation of Liability",
      content: "RailMate is not liable for any missed trains, financial loss, or inconvenience resulting from inaccurate data or service interruptions.",
    },
    {
      title: "10. Account Suspension/Termination Rights",
      content: "We reserve the right to suspend or terminate accounts that violate our terms or engage in behavior harmful to the community.",
    },
    {
      title: "11. Service Availability",
      content: "While we strive for 100% uptime, we do not guarantee constant availability. Scheduled maintenance and unexpected outages may occur.",
    },
    {
      title: "12. Premium Subscriptions",
      content: "RailMate+ subscriptions are auto-renewable and can be managed or cancelled anytime through your App Store or Play Store account settings.",
    },
    {
      title: "13. Changes to Terms",
      content: "We may update these terms from time to time. Material changes will be notified via in-app notification 14 days before taking effect.",
    },
    {
      title: "14. Governing Law",
      content: "These terms are governed by and construed in accordance with the laws of Bangladesh.",
    },
  ];

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeader
          title="Terms & Conditions"
          subtitle="Please read these terms carefully before using RailMate Bangladesh."
          centered
        />
        
        <div className="mt-12 space-y-8">
          {sections.map((section, index) => (
            <section key={index} className="bg-elevated p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold text-primary mb-4">{section.title}</h2>
              <p className="text-secondary leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 text-center text-tertiary text-sm">
          Last Updated: June 2026
        </div>
      </div>
    </main>
  );
}
