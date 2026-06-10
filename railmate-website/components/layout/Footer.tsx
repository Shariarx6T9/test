"use client";

import Link from 'next/link';
import { FacebookLogo, TwitterLogo, InstagramLogo } from '@phosphor-icons/react';

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
    </div>
  </Link>
);

const socialLinks = [
    { icon: FacebookLogo, href: "#" },
    { icon: TwitterLogo, href: "#" },
    { icon: InstagramLogo, href: "#" },
];

const productLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Download", href: "#download" },
    { name: "FAQ", href: "/faq" },
];

const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Copyright Notice", href: "/copyright" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-elevated border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="font-bengali text-sm text-text-secondary">
              আপনার রেলযাত্রা, সহজ করা হলো।
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, i) => (
                <a key={i} href={link.href} className="text-text-tertiary hover:text-primary transition-colors">
                  <link.icon size={20} />
                </a>
              ))}
            </div>
          </div>
          {/* Column 2: Product */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Product</h3>
            <ul className="space-y-2">
              {productLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-text-primary transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Column 3: Legal */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-text-primary transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Column 4: Data Notice */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Data Sources</h3>
            <p className="text-xs text-text-tertiary leading-relaxed">
              Schedule and fare data sourced from Bangladesh Railway official publications. Community reports are user-submitted. RailMate is not affiliated with Bangladesh Railway.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row justify-between items-center text-xs text-text-tertiary">
          <p>© 2025 RailMate Bangladesh · Built with ❤️ in Bangladesh</p>
          <a href="http://railway.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors mt-2 sm:mt-0">
            Data: railway.gov.bd
          </a>
        </div>
      </div>
    </footer>
  );
}
