'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const LABELS = {
  brand:    'RailMate',
  tagline:  'Bangladesh',
  download: 'Download App →',
}

const NAV_LINKS = [
  { label: 'Home',     href: '#hero' },
  { label: 'Features', href: '#features' },
  { label: 'About',    href: '#community' },
  { label: 'Download', href: '#download' },
  { label: 'FAQ',      href: '#faq' },
]

function LogoMark() {
  return (
    <div className="flex-shrink-0">
      <Image 
        src="/logo.png" 
        alt="RailMate Logo" 
        width={32} 
        height={32} 
        className="rounded-lg object-contain"
        priority
      />
    </div>
  )
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path d="M3 5.5h16M3 11h16M3 16.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path d="M17 5L5 17M5 5l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled ? 'nav-scrolled border-[#1E2E42]' : 'bg-transparent border-transparent'
      }`}
    >
      {/* ── Main Bar ── */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <LogoMark />
            <div className="flex flex-col leading-none">
              <span
                className="text-[#F0F4FF] font-bold text-[17px] leading-tight"
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                {LABELS.brand}
              </span>
              <span
                className="text-[#8FA3C0] uppercase tracking-[0.12em]"
                style={{ fontSize: '10px', fontFamily: 'var(--font-inter)' }}
              >
                {LABELS.tagline}
              </span>
            </div>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
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

          {/* Desktop CTA */}
          <a
            href="#download"
            className="hidden md:inline-flex items-center bg-[#00A859] hover:bg-[#007A40] text-[#080D17] font-medium text-sm px-5 py-2.5 rounded-md transition-colors duration-150"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {LABELS.download}
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#8FA3C0] hover:text-[#F0F4FF] transition-colors p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer — conditionally rendered, never duplicated ── */}
      <div
        className={`md:hidden bg-[#0F1929] border-t border-[#1E2E42] overflow-hidden transition-all duration-200 ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!menuOpen}
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
              {LABELS.download}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
