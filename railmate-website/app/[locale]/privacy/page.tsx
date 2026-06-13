import { buildMetadata } from "@/lib/metadata";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "RailMate Bangladesh Privacy Policy. Learn how we collect, use, store, and protect your data in compliance with Bangladesh Digital Security Act.",
  path: "/privacy",
});

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `Welcome to RailMate Bangladesh. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website ("Service").

By using RailMate Bangladesh, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our Service.

For questions or concerns about this policy, contact us at: privacy@railmatebd.com`,
  },
  {
    id: "data-collected",
    title: "2. Information We Collect",
    content: `We collect only the minimum data required to provide our Service:

Account Data: Phone number or email address, display name. We do not require your full legal name or National ID (NID).

Community Reports: When you submit a delay, crowding, or condition report, we collect the train name, report type, optional text description, and timestamp. Location data is only collected if you explicitly opt-in when submitting a report.

Device Information: OS version, app version, and device model to help us debug issues and improve performance. We do not collect unique device identifiers that can track you across applications.

Usage Analytics: Anonymized, aggregated data about screen views, feature usage, and session duration via PostHog. This data cannot be linked back to you individually.

Crash Reports: Technical error data via Sentry to help us fix bugs. Crash reports do not include personal information.`,
  },
  {
    id: "not-collected",
    title: "3. What We Do NOT Collect",
    content: `We believe in data minimization. RailMate Bangladesh does NOT collect:

— National Identification (NID) numbers
— Financial data, bank account details, or payment card numbers
— Precise real-time location tracking (unless you explicitly opt in for a specific report)
— Contacts, call logs, or SMS/text messages
— Biometric data of any kind
— Data from other apps on your device`,
  },
  {
    id: "how-used",
    title: "4. How We Use Your Information",
    content: `We use information we collect to:

— Provide and maintain the Service, including account creation and authentication
— Enable community features such as delay, crowding, and coach condition reporting
— Send push notifications about your saved routes (only if you enable them)
— Improve the app through aggregated, anonymized analytics
— Debug technical issues via crash reports
— Respond to your support inquiries and feedback
— Comply with legal obligations under Bangladesh law, including the Digital Security Act, 2018

We do not sell, trade, or rent your personal information to third parties for commercial purposes.`,
  },
  {
    id: "data-sharing",
    title: "5. Third-Party Services",
    content: `We use the following third-party services, each with their own privacy policies:

Supabase: Our primary database and authentication provider (EU data centers with encryption at rest and in transit).

RevenueCat: Handles premium subscription management. RevenueCat processes subscription purchase data but does not receive your payment card information.

PostHog: Privacy-focused product analytics with data anonymization enabled. PostHog is configured to respect Do Not Track browser settings.

Sentry: Real-time crash reporting. Sentry receives technical error data and stack traces but not personal user data.

Google AdMob: Serves contextual advertisements in the free version to keep the core service funded. AdMob may use advertising IDs in accordance with Google's Privacy Policy. You can opt out of personalized ads through your device settings.

Each third-party provider is contractually obligated to process your data only as directed by us and in compliance with applicable law.`,
  },
  {
    id: "data-retention",
    title: "6. Data Retention",
    content: `We retain your data only as long as necessary:

— Account data: Retained while your account is active. Deleted within 30 days of account deletion request.
— Community reports: Retained for 90 days, then permanently deleted.
— Analytics data: Aggregated and anonymized after 12 months; raw event data deleted after 30 days.
— Crash reports: Retained for 30 days then automatically purged.
— Support correspondence: Retained for 2 years for legal compliance.

When we no longer need your data for the purposes described in this policy, we securely delete or anonymize it.`,
  },
  {
    id: "your-rights",
    title: "7. Your Rights & Choices",
    content: `You have the following rights regarding your personal data:

Access: Request a copy of the personal data we hold about you.

Correction: Request correction of inaccurate or incomplete personal data.

Deletion: Request deletion of your account and associated personal data. You may do this in-app at Profile > Settings > Delete Account, or by emailing privacy@railmatebd.com. We will process deletion requests within 30 days.

Portability: Request an export of your data in a machine-readable format.

Objection: Object to processing of your personal data for direct marketing purposes.

Withdraw Consent: Where processing is based on consent (e.g., location data for reports), you may withdraw consent at any time through app settings.

To exercise any of these rights, email privacy@railmatebd.com with the subject line "Privacy Rights Request." We will respond within 30 days.`,
  },
  {
    id: "dsa-compliance",
    title: "8. Bangladesh Digital Security Act Compliance",
    content: `RailMate Bangladesh operates in compliance with the Bangladesh Digital Security Act, 2018 (DSA). We:

— Do not collect, store, or process data in ways that would violate the DSA or the Information and Communication Technology Act.
— Cooperate with lawful requests from Bangladesh government authorities where required by law, subject to appropriate legal process.
— Implement reasonable technical and organizational measures to protect data from unauthorized access, as required under applicable Bangladesh law.
— Do not transmit personal data outside Bangladesh except to the approved third-party processors listed in Section 5 above, which maintain appropriate data protection standards.`,
  },
  {
    id: "security",
    title: "9. Data Security",
    content: `We implement industry-standard security measures to protect your information:

— All data in transit is encrypted using TLS 1.2 or higher.
— All data at rest is encrypted using AES-256 encryption.
— Access to production databases is restricted to authorized personnel only, with multi-factor authentication required.
— We conduct periodic security reviews and promptly address identified vulnerabilities.
— We will notify affected users of any data breach that may impact their personal data within 72 hours of discovery.

However, no method of transmission over the internet or method of electronic storage is 100% secure. We cannot guarantee absolute security.`,
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    content: `RailMate Bangladesh is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@railmatebd.com and we will delete such information promptly.`,
  },
  {
    id: "cookies",
    title: "11. Cookies & Tracking Technologies",
    content: `Our website (railmatebd.com) uses minimal cookies:

Essential Cookies: Required for the website to function. These cannot be disabled. They include session management and security tokens.

Analytics Cookies: Used by PostHog to understand how visitors use our website. These are anonymized and can be disabled via your browser settings or a cookie preference manager.

We do not use advertising cookies on our website. The mobile app does not use browser cookies.`,
  },
  {
    id: "changes",
    title: "12. Changes to This Policy",
    content: `We may update this Privacy Policy periodically. Material changes will be communicated via:

— In-app notification at least 14 days before the change takes effect
— A prominent notice on our website
— Email notification to registered users (for significant changes)

Continued use of the Service after changes take effect constitutes acceptance of the revised policy. If you disagree with the updated policy, you may delete your account.`,
  },
  {
    id: "contact",
    title: "13. Contact Us",
    content: `For any privacy-related questions, requests, or concerns:

Email: privacy@railmatebd.com
Subject line: "Privacy Inquiry — [Your Name]"
Response time: Within 48 business hours

For legal inquiries: legal@railmatebd.com
For general support: support@railmatebd.com

Mailing address: RailMate Bangladesh, Dhaka, Bangladesh (Registered address available upon verified request)`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="pt-32 pb-24 bg-bg-base min-h-screen">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">

        <div className="mb-12">
          <SectionHeader title="Privacy Policy" align="left" />
          <div className="mt-4 flex flex-wrap gap-6 text-text-tertiary text-sm font-medium font-inter">
            <p>Effective Date: June 2026</p>
            <p>Last Updated: June 2026</p>
            <p>Version: 1.0</p>
          </div>
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-text-secondary text-sm font-inter leading-relaxed">
              <strong className="text-primary">Summary:</strong> We collect minimal data to run RailMate.
              We never sell your data. You can delete your account anytime.
              We comply with Bangladesh Digital Security Act, 2018.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-bg-elevated border border-border-subtle rounded-xl">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider font-inter mb-4">
            Contents
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-text-secondary hover:text-primary transition-colors font-inter"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Policy sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl font-jakarta font-extrabold text-text-primary mb-4">
                {section.title}
              </h2>
              <div className="text-text-secondary leading-relaxed font-inter text-sm whitespace-pre-line bg-bg-elevated p-6 rounded-lg border border-border-subtle">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border-subtle text-center">
          <p className="text-text-tertiary text-xs font-inter">
            This privacy policy was last reviewed by the RailMate Bangladesh team in June 2026.
            For questions, email{" "}
            <a href="mailto:privacy@railmatebd.com" className="text-primary hover:underline">
              privacy@railmatebd.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
