import { buildMetadata } from "@/lib/metadata";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "RailMate Bangladesh Privacy Policy. Learn how we collect, use, and protect your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="pt-32 pb-24 bg-base min-h-screen">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <SectionHeader title="Privacy Policy" align="left" />
          <div className="mt-4 flex gap-8 text-text-tertiary text-sm font-medium">
             <p>Effective Date: June 2026</p>
             <p>Last Updated: June 2026</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-12 text-text-secondary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-jakarta font-extrabold text-text-primary">1. Introduction</h2>
            <p>
              Welcome to RailMate Bangladesh. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at privacy@railmatebd.com.
            </p>
            <p>
              When you use our mobile application and our website, you trust us with your information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-jakarta font-extrabold text-text-primary">2. Information We Collect</h2>
            <p>We collect personal information that you voluntarily provide to us when registering at the App, expressing an interest in obtaining information about us or our products and services, when participating in activities on the App or otherwise contacting us.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account data:</strong> Phone number or email address, display name. We do not require your full legal name.</li>
              <li><strong>Community reports:</strong> Train name, report type, optional text, and timestamp. Location data is only collected if you explicitly opt-in when submitting a report.</li>
              <li><strong>Device info:</strong> OS version, app version, and device model to help us debug issues and improve performance.</li>
              <li><strong>Analytics:</strong> Anonymized data about screen views, feature usage, and session duration via PostHog.</li>
              <li><strong>Crash reports:</strong> Technical error data via Sentry to help us fix bugs.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-jakarta font-extrabold text-text-primary">3. What We Do NOT Collect</h2>
            <p>We believe in data minimization. We do NOT collect:</p>
            <ul className="list-disc pl-6 space-y-2 text-danger/80">
              <li>National ID (NID) numbers</li>
              <li>Financial data or bank account details</li>
              <li>Precise real-time location tracking (unless explicitly opted-in for a specific report)</li>
              <li>Contacts, call logs, or text messages</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-jakarta font-extrabold text-text-primary">4. How We Use Your Information</h2>
            <p>We use the information we collect or receive:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To enable community features like delay and crowding reporting.</li>
              <li>To send push notifications regarding your saved routes.</li>
              <li>To improve our App and user experience.</li>
              <li>To debug crashes and technical issues.</li>
              <li>For aggregate, anonymized analytics.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-jakarta font-extrabold text-text-primary">5. Data Retention</h2>
            <p>
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy. Account data is retained as long as your account is active. Community reports are typically retained for 90 days. Analytics data is kept for 12 months, and crash data for 30 days.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-jakarta font-extrabold text-text-primary">6. Your Rights</h2>
            <p>
              In some regions (like the EEA), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-jakarta font-extrabold text-text-primary">7. Account Deletion</h2>
            <p>
              You can delete your account at any time by going to <strong>Profile &gt; Settings &gt; Delete Account</strong> within the app. Alternatively, you can email us at privacy@railmatebd.com and we will process your request within 30 days.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-jakarta font-extrabold text-text-primary">8. Third-Party Services</h2>
            <p>We use the following third-party services to provide our platform:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase:</strong> Our primary database and authentication provider.</li>
              <li><strong>RevenueCat:</strong> Handles premium subscriptions.</li>
              <li><strong>PostHog:</strong> Privacy-focused product analytics.</li>
              <li><strong>Sentry:</strong> Real-time crash reporting.</li>
              <li><strong>Google AdMob:</strong> Serves minimal ads to keep the core service free.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-jakarta font-extrabold text-text-primary">9. Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may email us at <strong>privacy@railmatebd.com</strong> or by post to our office address listed on the contact page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
