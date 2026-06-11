import { buildMetadata } from "@/lib/metadata";
import ContactForm from "./ContactForm";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with RailMate Bangladesh. Support, partnerships, bug reports, and more.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactForm />;
}
