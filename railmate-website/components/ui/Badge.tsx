import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  children: ReactNode;
  className?: string;
}

export default function Badge({ variant = "neutral", children, className }: BadgeProps) {
  const variants = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-accent/10 text-accent border-accent/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    info: "bg-info/10 text-info border-info/20",
    neutral: "bg-bg-elevated text-text-secondary border-border",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
