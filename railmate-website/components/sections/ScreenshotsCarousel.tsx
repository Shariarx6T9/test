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

  const SCREENS = t.screenshots.screens as { id: string; label: string; description: string }[];

  const next = useCallback(() => setActive((i) => (i + 1) % SCREENS.length), [SCREENS.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + SCREENS.length) % SCREENS.length), [SCREENS.length]);

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
          <div className="relative w-[280px] h-[580px] rounded-[36px] border-[8px] border-border-strong bg-bg-card overflow-hidden shadow-2xl transition-all duration-300">
            {/* Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-border-strong rounded-b-2xl z-20" />

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
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-base via-bg-base/90 to-transparent z-10 text-center">
              <div className="text-primary text-xs font-bold uppercase tracking-widest mb-2 font-inter">
                {activeScreen.label}
              </div>
              <p className="text-text-secondary text-sm font-inter leading-relaxed">
                {activeScreen.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors bg-bg-card/50"
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
                    "h-2 w-6 rounded-full transition-all duration-300",
                    i === active ? "bg-primary w-10" : "bg-border-subtle hover:bg-bg-elevated"
                  )}
                  aria-label={`Go to screenshot ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors bg-bg-card/50"
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

