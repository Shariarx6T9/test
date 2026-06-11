import { buildMetadata } from "@/lib/metadata";
import CopyrightPageClient from "./CopyrightPageClient";

export const metadata = buildMetadata({
  title: "Copyright & Intellectual Property",
  description: "RailMate Bangladesh Copyright & Intellectual Property notice.",
  path: "/copyright",
});

export default function CopyrightPage() {
  return <CopyrightPageClient />;
}
