interface SectionHeaderProps {
  overline?: string
  headline: string
  subheadline?: string
  align?: 'left' | 'center'
  maxWidth?: string
}

export default function SectionHeader({
  overline,
  headline,
  subheadline,
  align = 'center',
  maxWidth = '680px',
}: SectionHeaderProps) {
  const textAlign = align === 'center' ? 'text-center' : 'text-left'
  const margin    = align === 'center' ? 'mx-auto' : ''

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
      <h2
        className="text-[#F0F4FF] font-extrabold"
        style={{
          fontSize: 'clamp(26px, 4vw, 36px)',
          fontFamily: 'var(--font-jakarta)',
          lineHeight: '1.2',
        }}
      >
        {headline}
      </h2>
      {subheadline && (
        <p
          className="mt-3 text-[#8FA3C0]"
          style={{
            fontSize: '17px',
            fontFamily: 'var(--font-inter)',
            lineHeight: '1.6',
          }}
        >
          {subheadline}
        </p>
      )}
    </div>
  )
}
