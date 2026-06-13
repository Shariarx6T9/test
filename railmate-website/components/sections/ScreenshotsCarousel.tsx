// components/sections/ScreenshotsCarousel.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useI18n } from "@/lib/i18n";
import clsx from "clsx";

// ─────────────────────────────────────────────────────────
// Inline SVG screen mockups — design-system colors only.
// Replaces via.placeholder.com images (no external deps,
// no stock/placeholder imagery, no CSP remotePatterns needed).
// ─────────────────────────────────────────────────────────

function ScreenFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 260 520"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
    >
      <rect width="260" height="520" fill="#0F1929" />
      {children}
    </svg>
  );
}

function SearchMockup() {
  return (
    <ScreenFrame>
      {/* status bar */}
      <rect x="0" y="0" width="260" height="28" fill="#080D17" />
      {/* header */}
      <text x="20" y="60" fill="#F0F4FF" fontSize="18" fontFamily="sans-serif" fontWeight="800">
        Find your train
      </text>
      {/* from field */}
      <rect x="20" y="84" width="220" height="44" rx="10" fill="#162035" stroke="#1E2E42" />
      <circle cx="40" cy="106" r="4" fill="#00A859" />
      <text x="56" y="111" fill="#8FA3C0" fontSize="13" fontFamily="sans-serif">Dhaka (Kamalapur)</text>
      {/* to field */}
      <rect x="20" y="140" width="220" height="44" rx="10" fill="#162035" stroke="#1E2E42" />
      <circle cx="40" cy="162" r="4" fill="#F5A623" />
      <text x="56" y="167" fill="#8FA3C0" fontSize="13" fontFamily="sans-serif">Chittagong</text>
      {/* date pill */}
      <rect x="20" y="196" width="105" height="36" rx="8" fill="#162035" stroke="#1E2E42" />
      <text x="35" y="219" fill="#F0F4FF" fontSize="12" fontFamily="sans-serif">Today</text>
      <rect x="135" y="196" width="105" height="36" rx="8" fill="#162035" stroke="#1E2E42" />
      <text x="150" y="219" fill="#F0F4FF" fontSize="12" fontFamily="sans-serif">All Classes</text>
      {/* search button */}
      <rect x="20" y="248" width="220" height="48" rx="10" fill="#00A859" />
      <text x="130" y="277" fill="#080D17" fontSize="14" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">
        Search Trains
      </text>
      {/* recent searches label */}
      <text x="20" y="336" fill="#4E6480" fontSize="11" fontFamily="sans-serif" letterSpacing="1">
        RECENT
      </text>
      <rect x="20" y="350" width="220" height="40" rx="8" fill="#162035" />
      <text x="34" y="375" fill="#8FA3C0" fontSize="12" fontFamily="sans-serif">Dhaka → Sylhet</text>
      <rect x="20" y="398" width="220" height="40" rx="8" fill="#162035" />
      <text x="34" y="423" fill="#8FA3C0" fontSize="12" fontFamily="sans-serif">Dhaka → Rajshahi</text>
    </ScreenFrame>
  );
}

function ResultsMockup() {
  const trains = [
    { name: "Subarna Express", time: "07:00 → 13:30", cls: "Snigdha", price: "৳520" },
    { name: "Turna Express", time: "23:00 → 05:30", cls: "AC Berth", price: "৳1150" },
    { name: "Mahanagar Provati", time: "08:00 → 14:10", cls: "Shovon", price: "৳265" },
  ];
  return (
    <ScreenFrame>
      <rect x="0" y="0" width="260" height="28" fill="#080D17" />
      <text x="20" y="60" fill="#F0F4FF" fontSize="16" fontFamily="sans-serif" fontWeight="800">
        Dhaka → Chittagong
      </text>
      <text x="20" y="80" fill="#8FA3C0" fontSize="11" fontFamily="sans-serif">12 trains found · Today</text>
      {trains.map((t, i) => {
        const y = 100 + i * 130;
        return (
          <g key={t.name}>
            <rect x="16" y={y} width="228" height="112" rx="12" fill="#162035" stroke="#1E2E42" />
            <rect x="16" y={y} width="3" height="112" rx="2" fill="#00A859" />
            <text x="32" y={y + 28} fill="#F0F4FF" fontSize="14" fontWeight="700" fontFamily="sans-serif">
              {t.name}
            </text>
            <text x="32" y={y + 50} fill="#8FA3C0" fontSize="12" fontFamily="sans-serif">{t.time}</text>
            <rect x="32" y={y + 64} width="70" height="22" rx="6" fill="#00A859" opacity="0.12" />
            <text x="42" y={y + 79} fill="#00A859" fontSize="10" fontFamily="sans-serif">{t.cls}</text>
            <text x="212" y={y + 79} fill="#F5A623" fontSize="14" fontWeight="700" fontFamily="sans-serif" textAnchor="end">
              {t.price}
            </text>
          </g>
        );
      })}
    </ScreenFrame>
  );
}

function FareMockup() {
  const rows = [
    { cls: "Shovon", price: "৳265" },
    { cls: "Shovon Chair", price: "৳320" },
    { cls: "Snigdha", price: "৳520" },
    { cls: "AC Berth", price: "৳1150" },
    { cls: "First Seat", price: "৳420" },
  ];
  return (
    <ScreenFrame>
      <rect x="0" y="0" width="260" height="28" fill="#080D17" />
      <text x="20" y="60" fill="#F0F4FF" fontSize="18" fontFamily="sans-serif" fontWeight="800">
        Fare Calculator
      </text>
      <text x="20" y="82" fill="#8FA3C0" fontSize="12" fontFamily="sans-serif">Dhaka → Chittagong</text>
      <rect x="20" y="100" width="220" height="2" fill="#1E2E42" />
      {rows.map((r, i) => {
        const y = 130 + i * 56;
        return (
          <g key={r.cls}>
            <rect x="20" y={y} width="220" height="44" rx="8" fill="#162035" />
            <text x="36" y={y + 27} fill="#F0F4FF" fontSize="13" fontFamily="sans-serif">{r.cls}</text>
            <text x="222" y={y + 27} fill="#F5A623" fontSize="14" fontWeight="700" fontFamily="sans-serif" textAnchor="end">
              {r.price}
            </text>
          </g>
        );
      })}
      <text x="20" y="420" fill="#4E6480" fontSize="10" fontFamily="sans-serif">
        Last verified: official BR fare chart
      </text>
    </ScreenFrame>
  );
}

function AlertsMockup() {
  const alerts = [
    { title: "Subarna Express delayed", sub: "20 min · Platform 4", color: "#E8394B" },
    { title: "Turna Express on time", sub: "Departs in 45 min", color: "#00A859" },
    { title: "Mahanagar — crowding high", sub: "Coach 3–5 reported full", color: "#F5A623" },
  ];
  return (
    <ScreenFrame>
      <rect x="0" y="0" width="260" height="28" fill="#080D17" />
      <text x="20" y="60" fill="#F0F4FF" fontSize="18" fontFamily="sans-serif" fontWeight="800">
        Departure Alerts
      </text>
      <circle cx="232" cy="52" r="14" fill="#00A859" opacity="0.15" />
      <text x="232" y="57" fill="#00A859" fontSize="14" fontFamily="sans-serif" textAnchor="middle" fontWeight="700">
        🔔
      </text>
      {alerts.map((a, i) => {
        const y = 90 + i * 110;
        return (
          <g key={a.title}>
            <rect x="20" y={y} width="220" height="92" rx="12" fill="#162035" stroke="#1E2E42" />
            <circle cx="42" cy={y + 30} r="6" fill={a.color} />
            <text x="60" y={y + 28} fill="#F0F4FF" fontSize="12" fontWeight="700" fontFamily="sans-serif">
              {a.title}
            </text>
            <text x="60" y={y + 48} fill="#8FA3C0" fontSize="11" fontFamily="sans-serif">{a.sub}</text>
            <text x="200" y="${y + 28}" fill="#4E6480" fontSize="10" fontFamily="sans-serif">now</text>
          </g>
        );
      })}
    </ScreenFrame>
  );
}

const MOCKUPS: Record<string, () => JSX.Element> = {
  search: SearchMockup,
  results: ResultsMockup,
  fare: FareMockup,
  alerts: AlertsMockup,
};

export default function ScreenshotsCarousel() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);

  const SCREENS = t.screenshots.screens as { id: string; label: string }[];

  const next = useCallback(() => setActive((i) => (i + 1) % SCREENS.length), [SCREENS.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + SCREENS.length) % SCREENS.length), [SCREENS.length]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const activeScreen = SCREENS[active];

  return (
    <section className="bg-gray-900 py-20" id="screenshots">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader
          overline={t.screenshots.overline}
          headline={t.screenshots.headline}
          subheadline={t.screenshots.subheadline}
        />

        <div className="mt-12 flex flex-col items-center gap-8">
          <div className="relative w-[260px] h-[520px] rounded-[36px] border-2 border-gray-700 bg-gray-800 overflow-hidden shadow-2xl transition-all duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-gray-900 rounded-b-lg z-10" />

            {SCREENS.map((screen, i) => {
              const Mockup = MOCKUPS[screen.id] ?? SearchMockup;
              return (
                <div
                  key={screen.id}
                  className={clsx(
                    "absolute inset-0 transition-opacity duration-500",
                    i === active ? "opacity-100" : "opacity-0"
                  )}
                >
                  <Mockup />
                </div>
              );
            })}

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold whitespace-nowrap z-10">
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
              {SCREENS.map((_, i) => (
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
            {SCREENS.map((screen, i) => (
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
