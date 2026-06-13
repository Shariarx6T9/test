'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useI18n } from '@/lib/i18n'
import { Sun, Moon, Translate, List, X, Train } from '@phosphor-icons/react'
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

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { label: t.nav.features,  href: '/features' },
    { label: t.nav.community, href: '/#community' },
    { label: t.nav.pricing,   href: '/#pricing' },
    { label: t.nav.business,  href: '/#business' },
    { label: t.nav.download,  href: '/download' },
  ]

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'bn' : 'en'
    router.replace(pathname, { locale: newLocale })
  }

  if (!mounted) return null

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg-base/80 backdrop-blur-md border-b border-border-subtle shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="RailMate Bangladesh — Home">
              <div className="flex-shrink-0 transition-transform group-hover:scale-105">
                <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                  <Train size={18} weight="fill" className="text-primary" />
                </div>
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
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <ul className="flex items-center gap-5 lg:gap-7">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-primary transition-colors text-sm font-medium font-inter whitespace-nowrap"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="h-4 w-px bg-border-subtle" />

              <div className="flex items-center gap-2 lg:gap-3">
                {/* Language Switcher Pill */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-subtle text-text-secondary hover:text-primary hover:border-primary/30 transition-all text-xs font-medium font-inter"
                  aria-label="Toggle language"
                >
                  <Translate size={14} weight="bold" />
                  <span>{locale === 'en' ? 'বাংলা' : 'EN'}</span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 text-text-secondary hover:text-primary transition-colors rounded-lg hover:bg-bg-elevated"
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
                </button>

                {/* Download CTA */}
                <Link
                  href="/download"
                  className="bg-primary hover:bg-primary-dim text-white font-bold text-sm px-4 lg:px-5 py-2.5 rounded-md transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95 font-inter whitespace-nowrap"
                >
                  {t.nav.cta}
                </Link>
              </div>
            </div>

            {/* Mobile: language + hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleLanguage}
                className="p-2 text-text-secondary hover:text-primary transition-colors"
                aria-label="Toggle language"
              >
                <Translate size={20} />
              </button>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-text-secondary hover:text-primary transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                className="text-text-secondary p-1.5 rounded-md hover:bg-bg-elevated transition-colors"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} /> : <List size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-bg-elevated z-50 md:hidden shadow-2xl transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-subtle">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                <Train size={16} weight="fill" className="text-primary" />
              </div>
              <span className="text-text-primary font-bold text-base font-jakarta">{t.common.brand}</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1.5 text-text-secondary hover:text-primary transition-colors rounded-md hover:bg-bg-card"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-5">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center py-3 px-3 text-base font-semibold text-text-primary hover:text-primary hover:bg-bg-card rounded-lg transition-all font-inter"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="h-px bg-border-subtle w-full my-5" />

            {/* Language toggle in drawer */}
            <button
              onClick={() => {
                toggleLanguage()
                setMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 py-3 px-3 text-text-secondary hover:text-primary hover:bg-bg-card rounded-lg transition-all font-inter text-sm"
            >
              <Translate size={18} />
              <span>{locale === 'en' ? 'বাংলা সংস্করণ দেখুন' : 'View in English'}</span>
            </button>
          </nav>

          {/* Drawer CTA */}
          <div className="p-5 border-t border-border-subtle">
            <Link
              href="/download"
              className="block w-full bg-primary text-white font-bold text-center py-3.5 rounded-lg font-inter text-sm hover:bg-primary-dim transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {t.nav.cta}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
