import { ReactNode } from "react";
import { GooglePlayLogo, AppleLogo, AndroidLogo } from "@phosphor-icons/react/dist/ssr";
import Badge from "./Badge";

interface DownloadButtonProps {
  platform: "google-play" | "app-store" | "apk";
  status?: "available" | "coming-soon";
  href?: string;
  className?: string;
}

export default function DownloadButton({
  platform,
  status = "available",
  href = "#",
  className = "",
}: DownloadButtonProps) {
  const isComingSoon = status === "coming-soon";

  const platforms: Record<DownloadButtonProps["platform"], {
    icon: any;
    label: string;
    brand: string;
    bg: string;
    text: string;
    hover: string;
    border?: string;
  }> = {
    "google-play": {
      icon: GooglePlayLogo,
      label: "Download on",
      brand: "Google Play",
      bg: "bg-primary",
      text: "text-bg-base",
      hover: "hover:bg-primary-dim",
    },
    "app-store": {
      icon: AppleLogo,
      label: "Download on",
      brand: "App Store",
      bg: "bg-bg-elevated",
      text: "text-text-primary",
      hover: "hover:bg-bg-card",
    },
    apk: {
      icon: AndroidLogo,
      label: "Download",
      brand: "Direct APK",
      bg: "bg-transparent",
      text: "text-text-primary",
      hover: "hover:bg-bg-elevated",
      border: "border border-border",
    },
  };

  const p = platforms[platform];
  const Icon = p.icon;

  return (
    <div className={`relative group ${className}`}>
      <a
        href={isComingSoon ? undefined : href}
        className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
          isComingSoon ? "opacity-50 grayscale cursor-not-allowed" : `${p.bg} ${p.text} ${p.hover} active:scale-95`
        } ${p.border || ""}`}
      >
        <Icon size={32} weight="fill" />
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{p.label}</span>
          <span className="text-lg font-jakarta font-extrabold">{p.brand}</span>
        </div>
      </a>
      {isComingSoon && (
        <div className="absolute -top-3 -right-3 rotate-12">
          <Badge variant="warning" className="shadow-lg">Coming Soon</Badge>
        </div>
      )}
    </div>
  );
}
