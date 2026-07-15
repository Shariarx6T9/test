import { buildMetadata } from "@/lib/metadata";
import AboutPageClient from "./AboutPageClient";

export const metadata = buildMetadata({
  title: "About RailMate",
  description: "Learn about RailMate Bangladesh - your independent railway companion built to simplify train travel across Bangladesh with real-time schedules, fares, and community reports.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageClient />;
}
