// components/sections/ScreenshotsCarousel.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { useI18n } from "@/lib/i18n";
import clsx from "clsx";

const MOCKUP_IMAGES: Record<string, string> = {
  search: "/screenshots/screen-search.png",
  results: "/screenshots/screen-results.png",
  fare: "/screenshots/screen-fare.png",
  alerts: "/screenshots/screen-alerts.png",
};

export default function ScreenshotsCarousel() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);

  const SCREENS = t.screenshots.screens as {
    id: string;
    label: string;
    description: string;
  }[];

  const next = useCallback(
    () => setActive((i) => (i + 1) % SCREENS.length),
    [SCREENS.length]
  );
  const prev = useCallback(
    () => setActive((i) => (i - 1 + SCREENS.length) % SCREENS.length),
    [SCREENS.length]
  );

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const activeScreen = SCREENS[active];

  return (
    <section className="bg-bg-base py-20" id="screenshots">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader
          overline={t.screenshots.overline}
          headline={t.screenshots.headline}
          subheadline={t.screenshots.subheadline}
        />

        <div className="mt-12 flex flex-col items-center gap-8">

          {/* Phone Frame — aspect ratio locked to iPhone 390:844 */}
          <div
            className="relative rounded-[44px] border-[10px] border-border-strong bg-[#080D17] overflow-hidden"
            style={{
              width: 270,
              height: Math.round(270 * (844 / 390)),
              boxShadow: '0 0 0 1px rgba(0,168,89,0.15), 0 8px 32px rgba(0,0,0,0.7), 0 0 40px rgba(0,168,89,0.12)',
            }}
          >
            {/* Dynamic island / notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#0a0a0a] rounded-full z-20" />

            {/* Screenshots — fill the entire phone frame, no caption overlap */}
            {SCREENS.map((screen, i) => (
              <div
                key={screen.id}
                className={clsx(
                  "absolute inset-0 transition-opacity duration-500",
                  i === active ? "opacity-100" : "opacity-0"
                )}
              >
                <Image
                  src={MOCKUP_IMAGES[screen.id]}
                  alt={screen.label}
                  fill
                  className="object-cover object-top"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Caption — outside the phone, below it. Never overlaps. */}
          <div className="text-center min-h-[64px] px-4 transition-all duration-300">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-inter">
              {activeScreen.label}
            </p>
            <p className="text-text-secondary text-sm font-inter leading-relaxed max-w-xs mx-auto">
              {activeScreen.description}
            </p>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-border-strong text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors bg-bg-card"
              aria-label="Previous screenshot"
            >
              &larr;
            </button>

            <div className="flex items-center gap-2">
              {SCREENS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={clsx(
                    "h-2 rounded-full transition-all duration-300",
                    i === active
                      ? "bg-primary w-8"
                      : "bg-border-strong hover:bg-text-tertiary w-2"
                  )}
                  aria-label={`Go to screenshot ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-border-strong text-text-secondary hover:text-text-primary transition-colors bg-bg-card"
              aria-label="Next screenshot"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
