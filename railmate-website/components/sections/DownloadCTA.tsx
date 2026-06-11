"use client";

import { useI18n } from "@/lib/i18n";
import DownloadButton from "@/components/ui/DownloadButton";

export default function DownloadCTA() {
  const { t } = useI18n();

  return (
    <section className="bg-gray-900 py-24" id="download">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4 font-inter">
            {t.cta.overline}
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white font-jakarta leading-tight">
            {t.cta.headline1}
            <br />
            {t.cta.headline2}
          </h2>

          <p className="mt-5 text-lg text-gray-400 font-inter leading-relaxed">
            {t.cta.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <DownloadButton
              platform="google-play"
              href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL!}
            />
            <DownloadButton
              platform="apk"
              href={process.env.NEXT_PUBLIC_APK_DOWNLOAD_URL!}
            />
            <DownloadButton
              platform="app-store"
              href={process.env.NEXT_PUBLIC_APP_STORE_URL!}
              status="coming-soon"
            />
          </div>

          <p className="mt-4 text-xs text-gray-600 font-inter">
            {t.cta.platform}
          </p>

          <p className="mt-8 text-xl text-gray-400 font-bengali">
            {t.cta.bengali}
          </p>
        </div>
      </div>
    </section>
  );
}
