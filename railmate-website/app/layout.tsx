import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "600"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Your Railway, Simplified. | RailMate Bangladesh",
  description:
    "RailMate is Bangladesh's most trusted railway companion app. Real-time schedules, fares, community reports, and smart journey tools. Download free on Android.",
  keywords: [
    "Bangladesh railway",
    "train schedule Bangladesh",
    "বাংলাদেশ রেলওয়ে সময়সূচি",
    "BR Explorer alternative",
    "train delay Bangladesh",
    "RailMate",
  ],
  metadataBase: new URL("https://railmatebd.com"),
  openGraph: {
    title: "Your Railway, Simplified. | RailMate Bangladesh",
    description:
      "Real-time schedules, fares, and community delay reports for Bangladesh Railway.",
    type: "website",
    locale: "en_BD",
    siteName: "RailMate Bangladesh",
  },
  themeColor: "#00A859",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${jakartaSans.variable} ${inter.variable} ${notoSansBengali.variable} bg-bg-base text-text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
