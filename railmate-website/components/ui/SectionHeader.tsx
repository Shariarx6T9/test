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
          className="text-primary uppercase mb-3 text-[11px] font-semibold tracking-[0.08em] font-inter"
        >
          {overline}
        </p>
      )}
      {headingText && (
        <h2
          className="text-text-primary font-extrabold font-jakarta leading-[1.2]"
          style={{
            fontSize: 'clamp(26px, 4vw, 36px)',
          }}
        >
          {headingText}
        </h2>
      )}
      {subText && (
        <p
          className="mt-3 text-text-secondary text-[17px] font-inter leading-[1.6]"
        >
          {subText}
        </p>
      )}
    </div>
  )
}
