interface SectionHeaderProps {
  overline?: string
  headline?: string
  title?: string        // alias for headline — keeps existing pages working
  subheadline?: string
  subtitle?: string     // alias for subheadline
  align?: 'left' | 'center'
  centered?: boolean    // shorthand for align="center"
  maxWidth?: string
}

export default function SectionHeader({
  overline,
  headline,
  title,
  subheadline,
  subtitle,
  align,
  centered,
  maxWidth = '680px',
}: SectionHeaderProps) {
  const finalAlign = centered ? 'center' : (align ?? 'center')
  const headingText = headline ?? title ?? ''
  const subText     = subheadline ?? subtitle
  const textAlign = finalAlign === 'center' ? 'text-center' : 'text-left'
  const margin    = finalAlign === 'center' ? 'mx-auto' : ''

  return (
    <div className={`${textAlign} ${margin}`} style={{ maxWidth }}>
      {overline && (
        <p
          className="text-[#00A859] uppercase mb-3"
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            letterSpacing: '0.08em',
          }}
        >
          {overline}
        </p>
      )}
      {headingText && (
        <h2
          className="text-[#F0F4FF] font-extrabold"
          style={{
            fontSize: 'clamp(26px, 4vw, 36px)',
            fontFamily: 'var(--font-jakarta)',
            lineHeight: '1.2',
          }}
        >
          {headingText}
        </h2>
      )}
      {subText && (
        <p
          className="mt-3 text-[#8FA3C0]"
          style={{
            fontSize: '17px',
            fontFamily: 'var(--font-inter)',
            lineHeight: '1.6',
          }}
        >
          {subText}
        </p>
      )}
    </div>
  )
}
