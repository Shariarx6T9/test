"use client";

import { useState, useEffect, useCallback } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import clsx from "clsx";

export default function ScreenshotsCarousel() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);

  const SCREENS = t.screenshots.screens.map((s: any) => ({
    ...s,
    src: `https://via.placeholder.com/300x600/0F1929/FFFFFF?text=${s.label.replace(' ', '+')}`,
  }));

  const next = useCallback(() => setActive((i) => (i + 1) % SCREENS.length), [SCREENS.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + SCREENS.length) % SCREENS.length), [SCREENS.length]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const activeScreen = SCREENS[active];

  return (
    <section className="bg-gray-900 py-20" id="screenshots">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          overline={t.screenshots.overline}
          headline={t.screenshots.headline}
          subheadline={t.screenshots.subheadline}
        />

        <div className="mt-12 flex flex-col items-center gap-8">
          <div className="relative w-[260px] h-[520px] rounded-[36px] border-2 border-gray-700 bg-gray-800 overflow-hidden shadow-2xl transition-all duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-gray-900 rounded-b-lg" />
            
            {SCREENS.map((screen: any, i: number) => (
              <Image
                key={screen.id}
                src={screen.src}
                alt={screen.label}
                width={260}
                height={520}
                className={clsx(
                  "absolute inset-0 transition-opacity duration-500",
                  i === active ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
            
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold whitespace-nowrap">
              {activeScreen.label}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
              aria-label="Previous screenshot"
            >
              &larr;
            </button>
            <div className="flex items-center gap-2">
              {SCREENS.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={clsx(
                    "h-2 w-2 rounded-full transition-colors",
                    i === active ? "bg-primary" : "bg-gray-700 hover:bg-gray-600"
                  )}
                  aria-label={`Go to screenshot ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
              aria-label="Next screenshot"
            >
              &rarr;
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {SCREENS.map((screen: any, i: number) => (
              <button
                key={screen.id}
                onClick={() => setActive(i)}
                className={clsx(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150 border",
                  i === active
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-transparent text-gray-500 border-gray-700 hover:bg-gray-800"
                )}
              >
                {screen.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
