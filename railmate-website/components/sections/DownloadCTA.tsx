const TRANSLATIONS = {
  overline:   'DOWNLOAD FREE TODAY',
  headline1:  'Stop guessing.',
  headline2:  'Start knowing.',
  subheadline:'Join Bangladeshi travelers who check RailMate before every train journey. Know if your train is late before you leave home.',
  playBtn:    'Download on Google Play',
  apkBtn:     'Download APK',
  platformNote:'Android 7.0+ required · iOS coming soon · 100% free to download',
  bengali:    'আপনার রেলযাত্রা, সহজ করা হলো।',
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8.25 5.29l6.5 4.25a.5.5 0 010 .92l-6.5 4.25A.5.5 0 017.5 14.25v-8.5a.5.5 0 01.75-.46z"/>
    </svg>
  )
}

function AndroidIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3.5 6.5h11v8a1 1 0 01-1 1h-9a1 1 0 01-1-1v-8z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 6.5V5a3 3 0 016 0v1.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="6.5" cy="10" r="0.75" fill="currentColor"/>
      <circle cx="11.5" cy="10" r="0.75" fill="currentColor"/>
      <path d="M6 2.5L5 1M12 2.5L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function DownloadCTA() {
  return (
    <section className="bg-[#080D17] py-24" id="download">
      <div className="container-inner">
        <div className="text-center max-w-[680px] mx-auto">

          {/* Overline */}
          <p
            className="text-[#00A859] uppercase mb-4"
            style={{ fontSize: '11px', fontFamily: 'var(--font-inter)', fontWeight: 600, letterSpacing: '0.08em' }}
          >
            {TRANSLATIONS.overline}
          </p>

          {/* Headline */}
          <h2
            className="text-[#F0F4FF] font-extrabold"
            style={{ fontSize: 'clamp(32px, 5vw, 44px)', fontFamily: 'var(--font-jakarta)', lineHeight: '1.1' }}
          >
            {TRANSLATIONS.headline1}
            <br />
            {TRANSLATIONS.headline2}
          </h2>

          {/* Sub */}
          <p
            className="mt-5 text-[#8FA3C0]"
            style={{ fontSize: '17px', fontFamily: 'var(--font-inter)', lineHeight: '1.6' }}
          >
            {TRANSLATIONS.subheadline}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-[#00A859] hover:bg-[#007A40] text-[#080D17] font-semibold rounded-md px-7 transition-colors duration-150"
              style={{ height: '52px', fontSize: '15px', fontFamily: 'var(--font-inter)' }}
            >
              <PlayIcon />
              {TRANSLATIONS.playBtn}
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-[#8FA3C0] hover:text-[#F0F4FF] rounded-md px-7 border border-[#2A3F57] hover:border-[#4E6480] transition-colors duration-150"
              style={{ height: '52px', fontSize: '15px', fontFamily: 'var(--font-inter)' }}
            >
              <AndroidIcon />
              {TRANSLATIONS.apkBtn}
            </a>
          </div>

          {/* Platform info */}
          <p
            className="mt-4 text-[#4E6480]"
            style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}
          >
            {TRANSLATIONS.platformNote}
          </p>

          {/* Bengali tagline */}
          <p
            className="mt-8 text-[#8FA3C0]"
            style={{ fontSize: '18px', fontFamily: 'var(--font-bengali)', lineHeight: '1.7' }}
          >
            {TRANSLATIONS.bengali}
          </p>

        </div>
      </div>
    </section>
  )
}
