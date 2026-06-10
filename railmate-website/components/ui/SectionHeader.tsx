import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  bengaliSubtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  bengaliSubtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`space-y-4 mb-12 ${centered ? "text-center" : "text-left"}`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-jakarta font-extrabold text-text-primary tracking-tight">
        {title}
      </h2>
      <div className="space-y-1">
        {bengaliSubtitle && (
          <p className="text-xl md:text-2xl font-bengali text-text-secondary leading-relaxed">
            {bengaliSubtitle}
          </p>
        )}
        {subtitle && (
          <p className="text-text-tertiary max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
