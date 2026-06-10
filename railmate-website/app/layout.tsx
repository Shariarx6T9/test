import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Noto_Sans_Bengali, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RailMate Bangladesh — Your Railway, Simplified.",
  description: "RailMate is Bangladesh's most trusted railway companion app. Real-time schedules, fares, community reports, and smart journey tools. Download free on Android.",
  openGraph: {
    title: "RailMate Bangladesh — Your Railway, Simplified.",
    description: "RailMate is Bangladesh's most trusted railway companion app. Real-time schedules, fares, community reports, and smart journey tools. Download free on Android.",
    siteName: "RailMate Bangladesh",
    type: "website",
    locale: "en_BD",
    url: "https://railmatebd.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "RailMate Bangladesh — Your Railway, Simplified.",
    description: "RailMate is Bangladesh's most trusted railway companion app.",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#00A859",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jakarta.variable} ${inter.variable} ${bengali.variable} ${mono.variable} antialiased bg-bg-base text-text-primary`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "RailMate Bangladesh",
              "url": "https://railmatebd.com",
              "logo": "https://railmatebd.com/logo.png",
              "description": "RailMate is Bangladesh's most trusted railway companion app — train schedules, fares, community reports, and smart journey tools.",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "email": "support@railmatebd.com"
              },
              "sameAs": [
                "https://facebook.com/railmatebd",
                "https://twitter.com/railmatebd"
              ]
            }),
          }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
