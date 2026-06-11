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
    'bg-[#00A859] hover:bg-[#007A40] text-[#080D17] font-semibold',
  secondary:
    'border border-[#2A3F57] hover:border-[#4E6480] text-[#8FA3C0] hover:text-[#F0F4FF] bg-transparent',
  ghost:
    'text-[#8FA3C0] hover:text-[#F0F4FF] bg-transparent',
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
