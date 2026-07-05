// app/privacy.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import { colors as C, spacing as S, typography as T } from '../theme';

const privacyPolicyContent = `# Privacy Policy for RailMate Bangladesh

**Last Updated:** July 3, 2026

Welcome to RailMate Bangladesh ("we," "our," "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (the "App").

Please read this Privacy Policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.

---

## 1. Information We Collect

We may collect information about you in a variety of ways. The information we may collect on the App includes:

### a. Personal Data You Provide to Us

We collect personal information that you voluntarily provide to us when you register for an account, submit a community report, or contact us. This information includes:

*   **Account Information:** When you create an account, we collect your \`display_name\`, \`email address\`, and/or \`phone number\`. This is used for authentication and to identify you within the community.
*   **Profile Information:** You may optionally provide a profile picture (\`avatar_url\`).
*   **Community Contributions:** When you submit a report, vote, or comment, we collect the content of your contribution, including \`descriptions\`, \`photos\`, \`delay times\`, and associate it with your user ID.

### b. Information Collected Through Permissions

To provide certain features, we request access to functions on your mobile device. We only access this information with your explicit permission.

*   **Location Data (\`ACCESS_FINE_LOCATION\`, \`ACCESS_COARSE_LOCATION\`):** We request location access to power the "Nearby Stations" feature. We do not store your location history. You can use the app without granting location permission, but this feature will be unavailable.
*   **Camera (\`CAMERA\`):** We request camera access to allow you to take and upload photos for community reports (e.g., a photo of a crowded coach or a station platform). We do not access your camera at any other time.
*   **Photo Library (\`NSPhotoLibraryUsageDescription\`):** We request photo library access so you can select and upload existing photos for your community reports.

### c. Automatically Collected Information

When you use the App, we may automatically collect certain information to help us improve our service:

*   **Crash Reports (via Sentry):** If the App crashes, we collect anonymous diagnostic information to help us identify and fix the bug. This includes device type, operating system version, and the state of the app at the time of the crash. This data does not contain personally identifiable information.
*   **Usage Analytics (via PostHog):** We collect anonymous data about how you interact with the App, such as which screens are viewed and which features are used most. This helps us understand what is valuable to our users so we can make the App better. This data is aggregated and cannot be used to identify you individually.

---

## 2. How We Use Your Information

We use the information we collect to:

*   Create and manage your account.
*   Provide the core services of the App, such as searching for trains and viewing schedules.
*   Operate the community reporting features, including displaying your reports, comments, and votes.
*   Enable features that require device permissions, like finding nearby stations.
*   Send you push notifications for alerts you have configured (e.g., delay alerts).
*   Monitor and analyze usage and trends to improve your experience.
*   Diagnose and fix technical problems and crashes.

---

## 3. How We Share Your Information

We do not sell your personal information. We may share information we have collected about you in certain situations:

*   **With Other Users:** Your \`display_name\`, \`avatar_url\`, and community contributions (reports, comments) are visible to other users of the App. Your email address and phone number are never shared publicly.
*   **With Third-Party Service Providers:** We use the following third-party services to operate the App:
    *   **Supabase:** Provides our database, authentication, and storage services. Your data is stored securely with Supabase.
    *   **Sentry:** Provides crash reporting services.
    *   **PostHog:** Provides product analytics services.
*   **By Law or to Protect Rights:** We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation, protect and defend our rights or property, or protect the personal safety of users of the App or the public.

---

## 4. Data Security

We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.

---

## 5. Data Retention & Account Deletion

We retain your personal information for as long as your account is active.

You have the right to delete your account at any time. You can find the account deletion option within the App's settings. When you delete your account:

*   Your personal information (email, phone number, display name, avatar) will be permanently deleted from our \`users\` table.
*   Your community reports and comments will be anonymized (your \`user_id\` will be removed), but the content itself may be retained to preserve the integrity of community-sourced data.

---

## 6. Children's Privacy

Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.

---

## 7. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.

---

## 8. Contact Us

If you have any questions about this Privacy Policy, please contact us at: **support@railmatebd.com** (Note: This is a placeholder email).

---

*This document is a template and should be reviewed by a legal professional before being used in a production application.*`;

const MarkdownViewer = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim() !== '');

  const renderLine = (line: string, index: number) => {
    if (line.startsWith('### ')) {
      return <Text key={index} style={styles.h3}>{line.substring(4)}</Text>;
    }
    if (line.startsWith('## ')) {
      return <Text key={index} style={styles.h2}>{line.substring(3)}</Text>;
    }
    if (line.startsWith('# ')) {
      return <Text key={index} style={styles.h1}>{line.substring(2)}</Text>;
    }
    if (line.startsWith('*   ')) {
      return (
        <View key={index} style={styles.bullet}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.body}>{line.substring(4)}</Text>
        </View>
      );
    }
    if (line.startsWith('---')) {
      return <View key={index} style={styles.divider} />;
    }

    const parts = line.split(/(\*\*.*?\*\*|\`.*?\`)/g).filter(Boolean);

    return (
      <Text key={index} style={styles.body}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <Text key={i} style={{ fontWeight: 'bold' }}>{part.slice(2, -2)}</Text>;
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return <Text key={i} style={styles.code}>{part.slice(1, -1)}</Text>;
          }
          return part;
        })}
      </Text>
    );
  };

  return (
    <View style={{ paddingHorizontal: S.xl, paddingBottom: S.xxxl }}>
      {lines.map(renderLine)}
    </View>
  );
};

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color={C.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Privacy Policy</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView>
        <MarkdownViewer content={privacyPolicyContent} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: C.white },
  h1: { fontSize: T.xxl, fontWeight: 'bold', color: C.white, marginBottom: S.lg, marginTop: S.lg },
  h2: { fontSize: T.xl, fontWeight: 'bold', color: C.white, marginBottom: S.md, marginTop: S.lg, borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: S.sm },
  h3: { fontSize: T.lg, fontWeight: 'bold', color: C.white, marginBottom: S.sm, marginTop: S.md },
  body: { fontSize: T.base, color: C.text2, lineHeight: 24, marginBottom: S.md },
  bullet: { flexDirection: 'row', marginBottom: S.sm, paddingLeft: S.md },
  bulletPoint: { color: C.text2, marginRight: S.sm, fontSize: T.base, lineHeight: 24 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: S.lg },
  code: { fontFamily: 'JetBrainsMono_400Regular', backgroundColor: C.surface2, color: C.text2, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
});