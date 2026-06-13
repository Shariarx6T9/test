'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useI18n } from '@/lib/i18n'
import { Sun, Moon, Translate, List, X } from '@phosphor-icons/react'
import { Link, usePathname, useRouter } from '@/lib/i18n/navigation'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const { locale, t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { label: t.nav.home,     href: '/' },
    { label: t.nav.features, href: '/features' },
    { label: t.nav.about,    href: '/about' },
    { label: t.nav.download, href: '/download' },
    { label: t.nav.faq,      href: '/faq' },
    { label: t.nav.contact,  href: '/contact' },
  ]

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'bn' : 'en'
    router.replace(pathname, { locale: newLocale })
  }

  if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled ? 'nav-scrolled' : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex-shrink-0 transition-transform group-hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="RailMate Logo" 
                width={32} 
                height={32} 
                className="rounded-lg object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-text-primary font-bold text-[17px] leading-tight font-jakarta">
                {t.common.brand}
              </span>
              <span className="text-text-tertiary uppercase tracking-[0.12em] text-[10px] font-inter">
                {t.common.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-7">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors text-sm font-medium font-inter"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="h-4 w-px bg-border-subtle" />

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="p-2 text-text-secondary hover:text-primary transition-colors"
                aria-label="Toggle language"
              >
                <Translate size={20} weight="bold" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-text-secondary hover:text-primary transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
              </button>

              {/* Download CTA */}
              <Link
                href="/download"
                className="bg-primary hover:bg-primary-dim text-white font-bold text-sm px-5 py-2.5 rounded-md transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95 font-inter"
              >
                {t.nav.cta}
              </Link>
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-text-secondary"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="text-text-secondary p-1"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden bg-bg-elevated border-t border-border-subtle overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-lg font-bold text-text-primary"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <div className="h-px bg-border-subtle w-full" />
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                toggleLanguage();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-text-secondary font-bold"
            >
              <Translate size={20} />
              {locale === 'en' ? 'বাংলা সংস্করণ' : 'English Version'}
            </button>
          </div>
          <Link
            href="/download"
            className="bg-primary text-white font-bold text-center py-4 rounded-lg"
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.cta}
          </Link>
        </ul>
      </div>
    </nav>
  )
}
