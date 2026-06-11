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

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
      <path d="M13.2 15.5c-.8 0-1.5-.3-2.1-.3-.6 0-1.3.3-2.1.3-1.4 0-3.6-1.8-3.6-5.1 0-3.1 2-4.8 4-4.8 1 0 1.8.4 2.2.4.4 0 1.2-.4 2.2-.4.8 0 2 .3 2.7 1.3-2 1.1-1.7 3.8.4 4.8-.5 1.3-1.2 2.7-2.4 3.7-.3.2-.6.4-1 .4zM10.2 3.3c0-1.2 1-2.2 2.2-2.2.1 0 .2 0 .3 0 0 1-.8 2.2-2.2 2.2-.1 0-.2 0-.3 0z" />
    </svg>
  )
}

const LABELS = {
  play: 'Download on Google Play',
  apk:  'Download APK',
  apple: 'Download on App Store',
  comingSoon: 'Coming Soon',
  note: 'App Store version coming soon · Free · Android 7.0+',
}

interface DownloadButtonProps {
  showNote?: boolean
  align?: 'left' | 'center'
  platform?: 'google-play' | 'apk' | 'app-store'
  className?: string
  status?: 'available' | 'coming-soon'
}

export default function DownloadButton({ 
  showNote = true, 
  align = 'left',
  platform,
  className = '',
  status = 'available'
}: DownloadButtonProps) {
  const justify = align === 'center' ? 'justify-center' : 'justify-start'
  const isComingSoon = status === 'coming-soon'

  if (platform) {
    let icon, label, href, bgColor, textColor, borderColor, hoverColor
    
    switch (platform) {
      case 'google-play':
        icon = <PlayIcon />
        label = LABELS.play
        href = "#"
        bgColor = "bg-[#00A859]"
        textColor = "text-[#080D17]"
        hoverColor = "hover:bg-[#007A40]"
        break
      case 'apk':
        icon = <AndroidIcon />
        label = LABELS.apk
        href = "#"
        bgColor = "bg-transparent"
        textColor = "text-[#8FA3C0]"
        borderColor = "border-[#2A3F57]"
        hoverColor = "hover:text-[#F0F4FF] hover:border-[#4E6480]"
        break
      case 'app-store':
        icon = <AppleIcon />
        label = isComingSoon ? LABELS.comingSoon : LABELS.apple
        href = "#"
        bgColor = isComingSoon ? "bg-[#1A2533]" : "bg-white"
        textColor = isComingSoon ? "text-[#4E6480]" : "text-black"
        borderColor = isComingSoon ? "border-[#2A3F57]" : "border-transparent"
        hoverColor = isComingSoon ? "" : "hover:bg-gray-200"
        break
    }

    return (
      <a
        href={isComingSoon ? undefined : href}
        className={`inline-flex items-center justify-center gap-2 font-semibold rounded-md px-7 transition-all duration-150 ${bgColor} ${textColor} ${borderColor ? `border ${borderColor}` : ''} ${hoverColor} ${className} ${isComingSoon ? 'cursor-not-allowed' : ''}`}
        style={{ height: '52px', fontSize: '15px', fontFamily: 'var(--font-inter)' }}
        aria-label={label}
      >
        {icon}
        {label}
      </a>
    )
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
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
