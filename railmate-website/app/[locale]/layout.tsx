import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, Noto_Sans_Bengali } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
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

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bhairail.vercel.app'),
    title: t('title'),
    description: t('description'),
    keywords: ['Bangladesh Railway', 'train schedule', 'BR timetable', 'rail app', 'ট্রেনের সময়সূচি'],
    manifest: '/manifest.json',
    icons: {
      icon: '/favicon.png',
      shortcut: '/favicon.png',
      apple: '/favicon.png',
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bhairail.vercel.app',
      siteName: 'RailMate Bangladesh',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'RailMate Bangladesh' }],
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og-image.png'],
    },
  }
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }]
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Fetch messages on the server so NextIntlClientProvider can pass them
  // to the client without an extra round-trip.
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${jakartaSans.variable} ${inter.variable} ${notoSansBengali.variable} font-inter antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/*
            NextIntlClientProvider MUST wrap any component that uses next-intl
            navigation hooks (useRouter, Link, usePathname from
            lib/i18n/navigation.ts).  I18nProvider sits inside it so that
            useParams is available for locale detection.
          */}
          <NextIntlClientProvider locale={locale} messages={messages}>
            <I18nProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </I18nProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "RailMate Bangladesh",
              "url": process.env.NEXT_PUBLIC_SITE_URL ?? "https://bhairail.vercel.app",
              "logo": `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://bhairail.vercel.app"}/logo.png`,
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@railmatebd.com"
              },
              "sameAs": []
            })
          }}
        />
      </body>
    </html>
  )
}
