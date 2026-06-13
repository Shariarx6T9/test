import { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  href?: string
  onClick?: () => void
  className?: string
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary hover:bg-primary-dim text-text-inverse font-semibold',
  secondary:
    'border border-border-strong text-text-secondary hover:text-text-primary hover:border-border-strong bg-transparent',
  ghost:
    'text-text-secondary hover:text-text-primary bg-transparent',
}

const sizes: Record<Size, string> = {
  sm: 'h-9  px-4 text-[13px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-[52px] px-7 text-[15px]',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'lg',
  href,
  onClick,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 rounded-md transition-colors duration-150 ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`

  if (href) {
    return (
      <a href={href} className={base} style={{ fontFamily: 'var(--font-inter)' }}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={base} style={{ fontFamily: 'var(--font-inter)' }}>
      {children}
    </button>
  )
}
