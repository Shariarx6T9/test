import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, Noto_Sans_Bengali } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { I18nProvider } from '@/lib/i18n'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '600'],
  variable: '--font-bengali',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://railmatebd.com'),
  title: 'RailMate Bangladesh — Travel Smarter. Travel RailMate.',
  description:
    'Real train schedules, live delay reports, and fare calculator for Bangladesh Railway. Free. Bengali & English. Works offline.',
  keywords: ['Bangladesh Railway', 'train schedule', 'BR timetable', 'rail app', 'ট্রেনের সময়সূচি'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'RailMate Bangladesh',
    description: 'Travel Smarter. Travel RailMate.',
    url: 'https://railmatebd.com',
    siteName: 'RailMate Bangladesh',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RailMate Bangladesh',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RailMate Bangladesh',
    description: 'Travel Smarter. Travel RailMate.',
    images: ['/og-image.png'],
  },
}

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'bn'}];
}

export default function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${jakartaSans.variable} ${inter.variable} ${notoSansBengali.variable} font-inter antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
