import { buildMetadata } from "@/lib/metadata";
import FAQAccordion from "./FAQAccordion";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Frequently asked questions about RailMate Bangladesh. Is it free? How accurate is the data? Does it sell tickets?",
  path: "/faq",
});

export default function FAQPage() {
  return <FAQAccordion />;
}
