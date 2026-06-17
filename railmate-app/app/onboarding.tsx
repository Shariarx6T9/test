// app/onboarding.tsx
// Legacy entry point — redirects to the approved multi-screen onboarding flow.
// Do NOT delete: expo-router needs this file to avoid a 404 for /onboarding.
import { Redirect } from 'expo-router';
export default function OnboardingRedirect() {
  return <Redirect href="/onboarding/welcome" />;
}
