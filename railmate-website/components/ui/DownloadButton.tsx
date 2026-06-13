"use client";

import { useI18n } from "@/lib/i18n";
import clsx from "clsx";

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M7.5 5.46l7 4.56-7 4.56V5.46z" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3.5 6.5h11v8a1 1 0 01-1 1h-9a1 1 0 01-1-1v-8z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 6.5V5a3 3 0 016 0v1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6.5" cy="10" r=".75" fill="currentColor" />
      <circle cx="11.5" cy="10" r=".75" fill="currentColor" />
      <path d="M6 2.5L5 1M12 2.5L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
      <path d="M13.2 15.5c-.8 0-1.5-.3-2.1-.3-.6 0-1.3.3-2.1.3-1.4 0-3.6-1.8-3.6-5.1 0-3.1 2-4.8 4-4.8 1 0 1.8.4 2.2.4.4 0 1.2-.4 2.2-.4.8 0 2 .3 2.7 1.3-2 1.1-1.7 3.8.4 4.8-.5 1.3-1.2 2.7-2.4 3.7-.3.2-.6.4-1 .4zM10.2 3.3c0-1.2 1-2.2 2.2-2.2.1 0 .2 0 .3 0 0 1-.8 2.2-2.2 2.2-.1 0-.2 0-.3 0z" />
    </svg>
  );
}

interface DownloadButtonProps {
  platform: "google-play" | "apk" | "app-store";
  href: string;
  className?: string;
  status?: "available" | "coming-soon";
}

export default function DownloadButton({
  platform,
  href,
  className = "",
  status = "available",
}: DownloadButtonProps) {
  const { t } = useI18n();
  const isComingSoon = status === "coming-soon";

  let icon, label, styleClasses;

  switch (platform) {
    case "google-play":
      icon = <PlayIcon />;
      label = t.download.play;
      styleClasses = "bg-primary text-text-inverse hover:bg-primary-dim";
      break;
    case "apk":
      icon = <AndroidIcon />;
      label = t.download.apk;
      styleClasses = "bg-transparent text-text-secondary border border-border-strong hover:text-text-primary hover:border-border-strong";
      break;
    case "app-store":
      icon = <AppleIcon />;
      label = isComingSoon ? t.download.coming_soon : t.download.apple;
      styleClasses = isComingSoon
        ? "bg-bg-card text-text-tertiary border border-border-subtle cursor-not-allowed"
        : "bg-text-primary text-bg-base hover:bg-text-secondary";
      break;
  }

  return (
    <a
      href={isComingSoon ? undefined : href}
      className={clsx(
        "inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 font-semibold font-inter transition-all duration-150",
        styleClasses,
        className
      )}
      aria-label={label}
    >
      {icon}
      {label}
    </a>
  );
}
