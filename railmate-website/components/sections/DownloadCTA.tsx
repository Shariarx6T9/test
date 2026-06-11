import DownloadButton from '@/components/ui/DownloadButton'

const COPY = {
  overline:    'DOWNLOAD FREE TODAY',
  headline1:   'Stop guessing.',
  headline2:   'Start knowing.',
  subheadline:
    'Join Bangladeshi travelers who check RailMate before every train journey. Know if your train is late before you leave home.',
  platform:    'Android 7.0+ required · iOS coming soon · 100% free to download',
  bengali:     'আপনার রেলযাত্রা, সহজ করা হলো।',
}

export default function DownloadCTA() {
  return (
    <section className="bg-[#080D17] py-24" id="download">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col items-center text-center" style={{ maxWidth: '680px', margin: '0 auto' }}>

          <p
            className="text-[#00A859] uppercase mb-4"
            style={{ fontSize: '11px', fontFamily: 'var(--font-inter)', fontWeight: 600, letterSpacing: '0.08em' }}
          >
            {COPY.overline}
          </p>

          <h2
            className="text-[#F0F4FF] font-extrabold"
            style={{ fontSize: 'clamp(32px, 5vw, 44px)', fontFamily: 'var(--font-jakarta)', lineHeight: '1.1' }}
          >
            {COPY.headline1}
            <br />
            {COPY.headline2}
          </h2>

          <p
            className="mt-5 text-[#8FA3C0]"
            style={{ fontSize: '17px', fontFamily: 'var(--font-inter)', lineHeight: '1.6' }}
          >
            {COPY.subheadline}
          </p>

          <div className="mt-8">
            <DownloadButton showNote={false} align="center" />
          </div>

          <p
            className="mt-4 text-[#4E6480]"
            style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}
          >
            {COPY.platform}
          </p>

          <p
            className="mt-8 text-[#8FA3C0]"
            style={{ fontSize: '18px', fontFamily: 'var(--font-bengali)', lineHeight: '1.7' }}
          >
            {COPY.bengali}
          </p>

        </div>
      </div>
    </section>
  )
}
