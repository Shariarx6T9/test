'use client'

import { useState, useEffect } from 'react'

const TRANSLATIONS = {
  tagline: 'Bangladesh',
  download: 'Download App →',
}

const NAV_LINKS = [
  { label: 'Home',     href: '#' },
  { label: 'Features', href: '#features' },
  { label: 'About',    href: '#community' },
  { label: 'Download', href: '#download' },
  { label: 'FAQ',      href: '#faq' },
]

function TrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="3" width="12" height="11" rx="3" stroke="#00A859" strokeWidth="1.5"/>
      <path d="M4 9h12" stroke="#00A859" strokeWidth="1.5"/>
      <path d="M7 14l-1.5 3M13 14l1.5 3" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="7" cy="11.5" r="1" fill="#00A859"/>
      <circle cx="13" cy="11.5" r="1" fill="#00A859"/>
      <path d="M8 3V2M12 3V2" stroke="#00A859" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [scrolled, setScrolled]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'nav-scrolled border-[#1E2E42]'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="container-inner">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#00A859] flex items-center justify-center">
              <TrainIcon />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-[#F0F4FF] font-display font-bold text-[17px] leading-tight"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                RailMate
              </span>
              <span
                className="text-[#8FA3C0] uppercase tracking-[0.12em]"
                style={{ fontSize: '10px', fontFamily: 'var(--font-inter)' }}
              >
                {TRANSLATIONS.tagline}
              </span>
            </div>
          </a>

          {/* ── Desktop Nav Links ── */}
          <ul className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[#8FA3C0] hover:text-[#F0F4FF] transition-colors duration-150 text-sm font-medium"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* ── Desktop CTA ── */}
          <a
            href="#download"
            className="hidden md:inline-flex items-center bg-[#00A859] hover:bg-[#007A40] text-[#080D17] font-medium text-sm px-5 py-2.5 rounded-md transition-colors duration-150"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {TRANSLATIONS.download}
          </a>

          {/* ── Mobile Hamburger ── */}
          <button
            className="md:hidden text-[#8FA3C0] hover:text-[#F0F4FF] transition-colors p-1"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Drawer ── */}
      <div
        className={`md:hidden bg-[#0F1929] border-t border-[#1E2E42] transition-all duration-200 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col divide-y divide-[#1E2E42]">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="flex items-center h-12 px-6 text-[#8FA3C0] hover:text-[#F0F4FF] transition-colors text-sm font-medium"
                style={{ fontFamily: 'var(--font-inter)' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#download"
              className="flex items-center h-12 px-6 text-[#00A859] font-semibold text-sm"
              style={{ fontFamily: 'var(--font-inter)' }}
              onClick={() => setMenuOpen(false)}
            >
              {TRANSLATIONS.download}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
