function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M7.5 5.46l7 4.56-7 4.56V5.46z" />
    </svg>
  )
}

function AndroidIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3.5 6.5h11v8a1 1 0 01-1 1h-9a1 1 0 01-1-1v-8z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 6.5V5a3 3 0 016 0v1.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="6.5" cy="10" r=".75" fill="currentColor"/>
      <circle cx="11.5" cy="10" r=".75" fill="currentColor"/>
      <path d="M6 2.5L5 1M12 2.5L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

const LABELS = {
  play: 'Download on Google Play',
  apk:  'Download APK',
  note: 'App Store version coming soon · Free · Android 7.0+',
}

interface DownloadButtonProps {
  showNote?: boolean
  align?: 'left' | 'center'
}

export default function DownloadButton({ showNote = true, align = 'left' }: DownloadButtonProps) {
  const justify = align === 'center' ? 'justify-center' : 'justify-start'

  return (
    <div className="flex flex-col gap-3">
      <div className={`flex flex-wrap gap-3 ${justify}`}>
        {/* Google Play — primary */}
        <a
          href="#"
          className="inline-flex items-center gap-2 bg-[#00A859] hover:bg-[#007A40] text-[#080D17] font-semibold rounded-md px-7 transition-colors duration-150"
          style={{ height: '52px', fontSize: '15px', fontFamily: 'var(--font-inter)' }}
          aria-label="Download RailMate on Google Play"
        >
          <PlayIcon />
          {LABELS.play}
        </a>

        {/* APK — secondary */}
        <a
          href="#"
          className="inline-flex items-center gap-2 text-[#8FA3C0] hover:text-[#F0F4FF] rounded-md px-7 border border-[#2A3F57] hover:border-[#4E6480] transition-colors duration-150"
          style={{ height: '52px', fontSize: '15px', fontFamily: 'var(--font-inter)' }}
          aria-label="Download RailMate APK directly"
        >
          <AndroidIcon />
          {LABELS.apk}
        </a>
      </div>

      {showNote && (
        <p
          className={`text-[#4E6480] ${align === 'center' ? 'text-center' : ''}`}
          style={{ fontSize: '12px', fontFamily: 'var(--font-inter)' }}
        >
          {LABELS.note}
        </p>
      )}
    </div>
  )
}
