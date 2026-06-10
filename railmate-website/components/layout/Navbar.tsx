"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Community", href: "#community" },
    { label: "Download", href: "#download" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s ease, border-color 0.3s ease",
        backgroundColor: scrolled ? "rgba(15,25,41,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1E2E42" : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "#00A859",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="7" width="16" height="2" rx="1" fill="white" opacity="0.9" />
              <rect x="2" y="11" width="16" height="2" rx="1" fill="white" opacity="0.9" />
              <path d="M14 5 L18 10 L14 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "16px", color: "#F0F4FF", lineHeight: 1.1 }}>
              RailMate
            </div>
            <div style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "10px", color: "#8FA3C0", letterSpacing: "0.1em" }}>
              BANGLADESH
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }} className="hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                color: "#8FA3C0",
                textDecoration: "none",
                fontSize: "14px",
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F4FF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8FA3C0")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="#download"
          className="hidden md:inline-flex"
          style={{
            backgroundColor: "#00A859",
            color: "#080D17",
            padding: "10px 20px",
            borderRadius: "10px",
            fontFamily: "var(--font-inter)",
            fontWeight: 600,
            fontSize: "14px",
            textDecoration: "none",
            transition: "background 0.15s ease",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#007A40")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00A859")}
        >
          Download App →
        </a>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{
            background: "none",
            border: "1px solid #1E2E42",
            borderRadius: "8px",
            padding: "8px",
            cursor: "pointer",
            color: "#F0F4FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu — single, conditional render */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: "#0F1929",
            borderTop: "1px solid #1E2E42",
            padding: "16px 24px 24px",
          }}
          className="md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "14px 0",
                color: "#8FA3C0",
                textDecoration: "none",
                fontFamily: "var(--font-inter)",
                fontSize: "16px",
                fontWeight: 500,
                borderBottom: "1px solid #1E2E42",
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#download"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              marginTop: "16px",
              backgroundColor: "#00A859",
              color: "#080D17",
              padding: "14px 20px",
              borderRadius: "10px",
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Download App →
          </a>
        </div>
      )}
    </nav>
  );
}
