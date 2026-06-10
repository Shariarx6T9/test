"use client";

import { GooglePlayLogo, AndroidLogo } from "@phosphor-icons/react";
import Link from "next/link";

export default function DownloadCTA() {
  return (
    <section id="download" className="bg-bg-base py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-primary font-semibold text-sm uppercase tracking-wider">
          Download Free Today
        </p>
        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-text-primary leading-tight">
          Stop guessing. Start knowing.
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary leading-relaxed">
          Join Bangladeshi travelers who check RailMate before every train journey. Know if your train is late before you leave home.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="#" className="inline-flex items-center gap-3 bg-primary text-text-inverse font-semibold h-14 px-7 rounded-md hover:bg-primary-dim transition-colors">
            <GooglePlayLogo size={24} weight="fill" />
            <span>Download on Google Play</span>
          </Link>
          <Link href="#" className="inline-flex items-center gap-3 border-2 border-border-strong text-text-secondary font-semibold h-14 px-7 rounded-md hover:bg-border-strong transition-colors">
            <AndroidLogo size={24} weight="fill" />
            <span>Download APK</span>
          </Link>
        </div>

        <p className="mt-4 text-sm text-text-tertiary">
          Android 7.0+ required · iOS coming soon · 100% free to download
        </p>

        <p className="mt-8 font-bengali text-xl text-text-secondary">
          আপনার রেলযাত্রা, সহজ করা হলো।
        </p>
      </div>
    </section>
  );
}
