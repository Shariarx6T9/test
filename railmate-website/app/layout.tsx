import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Noto_Sans_Bengali, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '600'],
  variable: '--font-bengali',
  display: 'swap',
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
    url: "https://bhairail.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "RailMate Bangladesh — Your Railway, Simplified.",
    description: "RailMate is Bangladesh's most trusted railway companion app.",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakartaSans.variable} ${inter.variable} ${notoSansBengali.variable} ${mono.variable}`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
