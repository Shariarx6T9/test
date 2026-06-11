import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, Noto_Sans_Bengali } from 'next/font/google'
import './globals.css'

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
  title: 'RailMate Bangladesh — Your Railway, Simplified',
  description:
    'Real train schedules, live delay reports, and fare calculator for Bangladesh Railway. Free. Bengali & English. Works offline.',
  keywords: ['Bangladesh Railway', 'train schedule', 'BR timetable', 'rail app', 'ট্রেনের সময়সূচি'],
  openGraph: {
    title: 'RailMate Bangladesh',
    description: 'Your Railway, Simplified. Real schedules, live delays, fare calculator.',
    type: 'website',
    locale: 'bn_BD',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn" className={`${jakartaSans.variable} ${inter.variable} ${notoSansBengali.variable}`}>
      <body className={`bg-[#080D17] text-[#F0F4FF] antialiased`}>
        {children}
      </body>
    </html>
  )
}
