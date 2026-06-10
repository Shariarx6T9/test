"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "About", href: "/about" },
  { name: "Download", href: "/download" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12 py-4",
        isScrolled
          ? "bg-bg-elevated/80 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
             <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H28M4 20H28M16 4C16 4 22 10 22 16C22 22 16 28 16 28C16 28 10 22 10 16C10 10 16 4 16 4Z" stroke="#00A859" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="16" cy="16" r="2" fill="#00A859" />
             </svg>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-baseline lg:gap-1.5">
            <span className="font-jakarta font-extrabold text-xl text-text-primary">RailMate</span>
            <span className="font-jakarta font-normal text-[10px] lg:text-xs uppercase tracking-[0.12em] text-text-secondary">Bangladesh</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-inter font-medium text-sm text-text-secondary hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/download"
            className="bg-primary hover:bg-primary-dim text-bg-base font-inter font-semibold px-5 py-2.5 rounded-md transition-all active:scale-95"
          >
            Download App
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-text-primary p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <List size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={cn(
          "fixed inset-0 top-[72px] bg-bg-base/95 backdrop-blur-xl z-40 lg:hidden transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col p-8 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-jakarta font-bold text-2xl text-text-primary hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/download"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-primary hover:bg-primary-dim text-bg-base font-jakarta font-bold text-center py-4 rounded-xl mt-4"
          >
            Download App
          </Link>
        </div>
      </div>
    </nav>
  );
}
