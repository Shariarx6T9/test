'use client'

import Image from 'next/image'
import { useI18n } from '@/lib/i18n'
import { FacebookLogo, TwitterLogo, InstagramLogo } from '@phosphor-icons/react'
import DownloadButton from '../ui/DownloadButton'
import { Link } from '@/lib/i18n/navigation'

export default function Footer() {
  const { t } = useI18n()

  const productLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.features, href: '/features' },
    { label: t.nav.download, href: '/download' },
    { label: t.nav.faq, href: '/faq' },
    { label: t.nav.contact, href: '/contact' },
  ]

  const legalLinks = [
    { label: t.footer.privacy, href: '/privacy' },
    { label: t.footer.terms, href: '/terms' },
    { label: t.footer.copyright_notice, href: '/copyright' },
  ]

  const socialLinks = [
    { label: 'Facebook', icon: <FacebookLogo size={20} />, href: '#' },
    { label: 'Twitter', icon: <TwitterLogo size={20} />, href: '#' },
    { label: 'Instagram', icon: <InstagramLogo size={20} />, href: '#' },
  ]

  return (
    <footer className="bg-bg-elevated border-t border-border-subtle pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Image 
                src="/logo.png" 
                alt="RailMate Logo" 
                width={32} 
                height={32} 
                className="rounded-lg object-contain"
              />
              <span className="text-text-primary font-bold text-xl font-jakarta">
                {t.common.brand}
              </span>
            </Link>
            <p className="text-text-secondary leading-relaxed font-inter">
              {t.footer.brand_desc}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((s) => (
                <a 
                  key={s.label} 
                  href={s.href} 
                  className="p-2 bg-bg-card rounded-full text-text-tertiary hover:text-primary transition-colors border border-border-subtle"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Download Column */}
          <div>
            <h4 className="text-text-primary font-bold uppercase tracking-wider text-xs mb-6 font-inter">
              {t.nav.download}
            </h4>
            <div className="space-y-3">
              <DownloadButton
                platform="google-play"
                href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL!}
              />
              <DownloadButton
                platform="app-store"
                href={process.env.NEXT_PUBLIC_APP_STORE_URL!}
                status="coming-soon"
              />
              <DownloadButton
                platform="apk"
                href={process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL!}
              />
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-text-primary font-bold uppercase tracking-wider text-xs mb-6 font-inter">
              {t.footer.product}
            </h4>
            <ul className="space-y-4">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-text-secondary hover:text-primary transition-colors font-inter text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-text-primary font-bold uppercase tracking-wider text-xs mb-6 font-inter">
              {t.footer.legal}
            </h4>
            <ul className="space-y-4">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-text-secondary hover:text-primary transition-colors font-inter text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-tertiary text-xs font-inter">
            {t.footer.copyright}
          </p>
          <p className="text-text-tertiary text-xs font-inter text-center md:text-left">
            {t.footer.data_notice}
          </p>
          <div className="flex items-center gap-6">
             <span className="text-[10px] text-text-tertiary px-2 py-1 border border-border-subtle rounded uppercase tracking-widest font-bold">
               v1.0.0-production
             </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
