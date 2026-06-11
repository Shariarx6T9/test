const TRANSLATIONS = {
  overline:        "🇧🇩  Bangladesh's #1 Railway Companion App",
  headline1:       'Your Railway,',
  headline2:       'Simplified',
  period:          '.',
  bengaliSub:      'আপনার রেলযাত্রা, সহজ করা হলো।',
  body:            'Stop using 3 different apps just to catch one train. RailMate gives you real schedules, real fares, and live delay reports from fellow travelers — all in one place. Free.',
  badge1:          'Free Forever',
  badge2:          'Bengali + English',
  badge3:          'Works Offline',
  playBtn:         'Download on Google Play',
  apkBtn:          'Download APK',
  apkNote:         'App Store version coming soon · Free · Android 7.0+',
  phoneHeader:     '← Dhaka → Chittagong',
  phoneSub:        'Thu 11 Jun · All Classes',
  train1:          'Subarna Express #721',
  train1Time:      '06:40  ────  11:15  (4h 35m)',
  train1Delay:     '⚠ 15 min delay reported',
  train2:          'Sonar Bangla Exp #787',
  train2Time:      '07:00  ────  12:00  (5h 00m)',
  train2OnTime:    '✓ On time',
  liveReport:      '🔴 8 travelers confirm delay on Subarna Express',
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.25" stroke="#00C977" strokeWidth="1.5"/>
      <path d="M4.5 7l2 2 3-3" stroke="#00C977" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
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

export default function HeroSection() {
  return (
    <section className="hero-bg min-h-screen flex items-center pt-16 relative overflow-hidden" id="hero">
      <div className="container-inner w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 py-16 lg:py-24">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 max-w-[600px]">

            {/* Overline */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-6 text-[#00A859]"
              style={{ background: 'rgba(0,168,89,0.10)', fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {TRANSLATIONS.overline}
            </div>

            {/* Headline */}
            <h1
              className="font-display font-extrabold leading-[1.1] text-[#F0F4FF]"
              style={{ fontSize: 'clamp(32px, 5.5vw, 56px)', fontFamily: 'var(--font-jakarta)' }}
            >
              {TRANSLATIONS.headline1}
              <br />
              {TRANSLATIONS.headline2}
              <span style={{ color: '#00A859' }}>{TRANSLATIONS.period}</span>
            </h1>

            {/* Bengali Subheadline */}
            <p
              className="mt-2 text-[#8FA3C0]"
              style={{ fontSize: '18px', lineHeight: '1.7', fontFamily: 'var(--font-bengali)' }}
            >
              {TRANSLATIONS.bengaliSub}
            </p>

            {/* Body */}
            <p
              className="mt-4 text-[#8FA3C0]"
              style={{ fontSize: '17px', lineHeight: '1.65', maxWidth: '520px', fontFamily: 'var(--font-inter)' }}
            >
              {TRANSLATIONS.body}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mt-5">
              {[TRANSLATIONS.badge1, TRANSLATIONS.badge2, TRANSLATIONS.badge3].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[#8FA3C0] border border-[#2A3F57]"
                  style={{ fontSize: '12px', fontFamily: 'var(--font-inter)', fontWeight: 500 }}
                >
                  <CheckCircleIcon />
                  {badge}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="#download"
                className="inline-flex items-center gap-2 bg-[#00A859] hover:bg-[#007A40] text-[#080D17] font-semibold rounded-md px-7 transition-colors duration-150"
                style={{ height: '52px', fontSize: '15px', fontFamily: 'var(--font-inter)' }}
              >
                <PlayIcon />
                {TRANSLATIONS.playBtn}
              </a>
              <a
                href="#download"
                className="inline-flex items-center gap-2 text-[#8FA3C0] hover:text-[#F0F4FF] rounded-md px-7 border border-[#2A3F57] hover:border-[#4E6480] transition-colors duration-150"
                style={{ height: '52px', fontSize: '15px', fontFamily: 'var(--font-inter)' }}
              >
                <AndroidIcon />
                {TRANSLATIONS.apkBtn}
              </a>
            </div>
            <p className="mt-3 text-[#4E6480]" style={{ fontSize: '12px', fontFamily: 'var(--font-inter)' }}>
              {TRANSLATIONS.apkNote}
            </p>
          </div>

          {/* ── RIGHT COLUMN — PHONE MOCKUP ── */}
          <div className="hidden lg:block flex-shrink-0">
            <div
              className="relative"
              style={{
                width: '280px',
                height: '560px',
                borderRadius: '36px',
                border: '2px solid #2A3F57',
                background: '#0F1929',
                padding: '20px',
                boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 40px rgba(0,168,89,0.08)',
                overflow: 'hidden',
              }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#080D17] rounded-b-xl" />

              {/* Header Bar */}
              <div className="mt-6 mb-3">
                <p className="text-[#F0F4FF] font-semibold" style={{ fontSize: '14px', fontFamily: 'var(--font-inter)' }}>
                  {TRANSLATIONS.phoneHeader}
                </p>
                <p className="text-[#8FA3C0] mt-0.5" style={{ fontSize: '12px', fontFamily: 'var(--font-inter)' }}>
                  {TRANSLATIONS.phoneSub}
                </p>
                <div className="mt-2 h-px bg-[#1E2E42]" />
              </div>

              {/* Train Card 1 */}
              <div className="mt-3 rounded-lg bg-[#162035] border border-[#1E2E42] overflow-hidden" style={{ borderLeft: '3px solid #00A859' }}>
                <div className="p-3">
                  <p className="text-[#F0F4FF] font-semibold" style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
                    {TRANSLATIONS.train1}
                  </p>
                  <p className="text-[#F0F4FF] mt-1" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    {TRANSLATIONS.train1Time}
                  </p>
                  <span
                    className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[#F5A623]"
                    style={{ fontSize: '10px', background: 'rgba(245,166,35,0.12)', fontFamily: 'var(--font-inter)' }}
                  >
                    {TRANSLATIONS.train1Delay}
                  </span>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {['S_CHAIR', 'SNIGDHA', 'AC_BERTH'].map((cls) => (
                      <span key={cls} className="px-1.5 py-0.5 rounded text-[#00A859]"
                        style={{ fontSize: '9px', background: 'rgba(0,168,89,0.10)', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Train Card 2 */}
              <div className="mt-2.5 rounded-lg bg-[#162035] border border-[#1E2E42] overflow-hidden" style={{ borderLeft: '3px solid #00A859' }}>
                <div className="p-3">
                  <p className="text-[#F0F4FF] font-semibold" style={{ fontSize: '13px', fontFamily: 'var(--font-inter)' }}>
                    {TRANSLATIONS.train2}
                  </p>
                  <p className="text-[#F0F4FF] mt-1" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    {TRANSLATIONS.train2Time}
                  </p>
                  <span
                    className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[#00C977]"
                    style={{ fontSize: '10px', background: 'rgba(0,201,119,0.10)', fontFamily: 'var(--font-inter)' }}
                  >
                    {TRANSLATIONS.train2OnTime}
                  </span>
                </div>
              </div>

              {/* Live Report */}
              <div
                className="mt-3 animate-float rounded-lg p-3"
                style={{ background: '#1A2840' }}
              >
                <p className="text-[#8FA3C0]" style={{ fontSize: '11px', fontFamily: 'var(--font-inter)', lineHeight: '1.5' }}>
                  {TRANSLATIONS.liveReport}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
