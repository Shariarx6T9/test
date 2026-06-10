"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { List, X, GooglePlayLogo, AndroidLogo } from "@phosphor-icons/react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "About", href: "/about" },
  { name: "Download", href: "#download" },
  { name: "FAQ", href: "/faq" },
];

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-primary flex justify-center items-center flex-shrink-0">
       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 2V14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M11 2V14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M2 5H14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M2 11H14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    </div>
    <div className="flex flex-col">
      <span className="font-display font-bold text-lg text-text-primary leading-none">RailMate</span>
      <span className="font-display text-[10px] text-text-secondary tracking-[0.12em] leading-none mt-1">BANGLADESH</span>
    </div>
  </Link>
);


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-bg-elevated/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo />

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-text-secondary hover:text-text-primary transition-colors duration-150 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Link
              href="#download"
              className="group inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-text-inverse bg-primary hover:bg-primary-dim rounded-md transition-colors duration-200"
            >
              Download App
              <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-bg-elevated/95 backdrop-blur-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-text-secondary hover:text-text-primary block px-3 py-3 rounded-md text-base font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="px-4 pb-4">
             <Link
              href="#download"
              className="group w-full flex items-center justify-center px-5 py-3 text-base font-semibold text-text-inverse bg-primary hover:bg-primary-dim rounded-md transition-colors duration-200"
            >
              Download App
              <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
        </div>
      </div>
    </header>
  );
}
