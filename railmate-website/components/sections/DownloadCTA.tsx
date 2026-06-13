"use client";

import { useI18n } from "@/lib/i18n";
import DownloadButton from "@/components/ui/DownloadButton";

export default function DownloadCTA() {
  const { t } = useI18n();

  return (
    <section className="bg-bg-base py-20 md:py-28" id="download">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 font-inter">
            {t.cta.overline}
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary font-jakarta leading-tight">
            {t.cta.headline1}
            <br />
            {t.cta.headline2}
          </h2>

          <p className="mt-5 text-lg text-text-secondary font-inter leading-relaxed">
            {t.cta.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <DownloadButton
              platform="google-play"
              href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || "#"}
              status={!process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL === "#" ? "coming-soon" : "available"}
            />
            <DownloadButton
              platform="app-store"
              href={process.env.NEXT_PUBLIC_APP_STORE_URL || "#"}
              status={!process.env.NEXT_PUBLIC_APP_STORE_URL || process.env.NEXT_PUBLIC_APP_STORE_URL === "#" ? "coming-soon" : "available"}
            />
          </div>

          <p className="mt-4 text-xs text-text-tertiary font-inter">
            {t.cta.platform}
          </p>

          <p className="mt-8 text-xl text-text-secondary font-bengali">
            {t.cta.bengali}
          </p>
        </div>
      </div>
    </section>
  );
}
