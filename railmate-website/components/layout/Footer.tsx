import Link from "next/link";
import { FacebookLogo, TwitterLogo, InstagramLogo, LinkedinLogo, GithubLogo } from "@phosphor-icons/react/dist/ssr";

const footerLinks = {
  Product: [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Download", href: "/download" },
    { name: "FAQ", href: "/faq" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Copyright Notice", href: "/copyright" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: FacebookLogo, href: "https://facebook.com/railmatebd" },
  { icon: TwitterLogo, href: "https://twitter.com/railmatebd" },
  { icon: InstagramLogo, href: "https://instagram.com/railmatebd" },
  { icon: LinkedinLogo, href: "https://linkedin.com/company/railmatebd" },
  { icon: GithubLogo, href: "https://github.com/railmatebd" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-base border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12H28M4 20H28M16 4C16 4 22 10 22 16C22 22 16 28 16 28C16 28 10 22 10 16C10 10 16 4 16 4Z" stroke="#00A859" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="16" cy="16" r="2" fill="#00A859" />
                </svg>
                <span className="font-jakarta font-extrabold text-2xl text-text-primary">RailMate</span>
              </Link>
              <div className="space-y-1">
                <p className="text-text-primary font-jakarta font-semibold text-lg">Your Railway, Simplified.</p>
                <p className="text-text-secondary font-bengali text-lg leading-relaxed">আপনার রেলযাত্রা, সহজ করা হলো।</p>
              </div>
              <p className="text-text-tertiary max-w-sm text-sm leading-relaxed">
                RailMate is Bangladesh's most trusted railway companion app, providing real-time intelligence for smarter travel.
              </p>
            </div>

            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all"
                >
                  <social.icon size={20} weight="regular" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-4">
                <h4 className="font-jakarta font-bold text-text-primary text-sm uppercase tracking-wider">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-text-secondary hover:text-primary text-sm transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-tertiary text-xs">
            © 2025 RailMate Bangladesh. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-text-tertiary text-xs">
            <span>Built with</span>
            <span className="text-danger">❤️</span>
            <span>in Bangladesh.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
