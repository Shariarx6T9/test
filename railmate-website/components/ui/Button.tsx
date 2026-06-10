import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-bg-base hover:bg-primary-dim shadow-lg shadow-primary/10",
    secondary: "bg-bg-elevated text-text-primary border border-border hover:border-border-strong",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary/5",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm font-semibold",
    lg: "px-8 py-4 text-base font-bold",
  };

  return (
    <button
      className={cn(
        "rounded-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
