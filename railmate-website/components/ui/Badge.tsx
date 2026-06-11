import { ReactNode } from 'react'

type BadgeVariant = 'free' | 'pro' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const styles: Record<BadgeVariant, { bg: string; color: string }> = {
  free:    { bg: 'rgba(0,168,89,0.10)',   color: '#00A859' },
  pro:     { bg: 'rgba(245,166,35,0.12)', color: '#F5A623' },
  success: { bg: 'rgba(0,201,119,0.10)',  color: '#00C977' },
  danger:  { bg: 'rgba(232,57,75,0.10)',  color: '#E8394B' },
  warning: { bg: 'rgba(245,166,35,0.10)', color: '#F5A623' },
  info:    { bg: 'rgba(78,168,224,0.10)', color: '#4EA8E0' },
  neutral: { bg: 'rgba(143,163,192,0.10)',color: '#8FA3C0' },
}

export default function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const { bg, color } = styles[variant]
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide ${className}`}
      style={{ background: bg, color, fontFamily: 'var(--font-inter)' }}
    >
      {children}
    </span>
  )
}
