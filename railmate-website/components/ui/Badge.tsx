import { ReactNode } from 'react'

type BadgeVariant = 'free' | 'pro' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  free:    'bg-primary/10 text-primary',
  pro:     'bg-accent/12 text-accent',
  success: 'bg-success/10 text-success',
  danger:  'bg-danger/10 text-danger',
  warning: 'bg-accent/10 text-accent',
  info:    'bg-info/10 text-info',
  neutral: 'bg-text-tertiary/10 text-text-tertiary',
}

export default function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide font-inter ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
