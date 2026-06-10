"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Community", href: "#community" },
  { label: "Download", href: "#download" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-elevated/95 backdrop-blur-md border-b border-border shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="7" width="16" height="2" rx="1" fill="white" opacity="0.9" />
              <rect x="2" y="11" width="16" height="2" rx="1" fill="white" opacity="0.9" />
              <path d="M14 5 L18 10 L14 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <div>
            <div className="font-display font-bold text-lg text-text-primary leading-none tracking-tight">
              RailMate
            </div>
            <div className="font-body font-medium text-[10px] text-text-secondary tracking-[0.15em] leading-none mt-1 uppercase">
              Bangladesh
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="#download"
            className="bg-primary hover:bg-primary-dim text-bg-base px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/10 active:scale-95"
          >
            Download App →
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-text-primary focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-bg-elevated border-b border-border transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-[400px] opacity-100 py-6 px-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-text-secondary hover:text-text-primary text-base font-medium py-2 border-b border-border/50"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#download"
            onClick={() => setMenuOpen(false)}
            className="bg-primary text-bg-base py-4 rounded-xl font-bold text-center mt-4 shadow-lg shadow-primary/10"
          >
            Download App →
          </Link>
        </div>
      </div>
    </nav>
  );
}
