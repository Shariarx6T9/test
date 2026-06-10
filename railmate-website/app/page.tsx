import Navbar from "@/components/Navbar";

const S = {
  // Layout
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
  } as React.CSSProperties,

  // Typography helpers
  overline: {
    display: "inline-block",
    fontFamily: "var(--font-inter)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#00A859",
    backgroundColor: "rgba(0,168,89,0.1)",
    padding: "6px 14px",
    borderRadius: "9999px",
    marginBottom: "20px",
  } as React.CSSProperties,

  h1: {
    fontFamily: "var(--font-jakarta)",
    fontSize: "clamp(36px, 6vw, 60px)",
    fontWeight: 800,
    lineHeight: 1.1,
    color: "#F0F4FF",
    marginBottom: "12px",
  } as React.CSSProperties,

  h2: {
    fontFamily: "var(--font-jakarta)",
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: 800,
    lineHeight: 1.2,
    color: "#F0F4FF",
    marginBottom: "16px",
  } as React.CSSProperties,

  body: {
    fontFamily: "var(--font-inter)",
    fontSize: "16px",
    lineHeight: 1.65,
    color: "#8FA3C0",
  } as React.CSSProperties,

  // Buttons
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#00A859",
    color: "#080D17",
    padding: "14px 28px",
    borderRadius: "10px",
    fontFamily: "var(--font-inter)",
    fontWeight: 700,
    fontSize: "15px",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    transition: "background 0.15s ease",
  } as React.CSSProperties,

  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "transparent",
    color: "#8FA3C0",
    padding: "13px 24px",
    borderRadius: "10px",
    fontFamily: "var(--font-inter)",
    fontWeight: 600,
    fontSize: "15px",
    textDecoration: "none",
    border: "1.5px solid #2A3F57",
    cursor: "pointer",
    transition: "border-color 0.15s ease, color 0.15s ease",
  } as React.CSSProperties,

  // Cards
  card: {
    backgroundColor: "#162035",
    border: "1px solid #1E2E42",
    borderRadius: "16px",
    padding: "24px",
  } as React.CSSProperties,
};

// ─── REUSABLE DOWNLOAD BUTTONS ───────────────────────────────────────────────
function DownloadButtons() {
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
      <a href="#" style={S.btnPrimary}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
        </svg>
        Download on Google Play
      </a>
      <a href="#" style={S.btnSecondary}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.32.07 2.22.74 2.98.8 1.11-.22 2.18-.91 3.39-.84 1.44.07 2.52.6 3.22 1.53-2.9 1.74-2.22 5.56.44 6.62-.52 1.39-1.2 2.76-2.03 4.77zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        Download APK
      </a>
    </div>
  );
}

// ─── TRUST BADGES ─────────────────────────────────────────────────────────────
function TrustBadge({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      border: "1px solid #2A3F57", borderRadius: "9999px",
      padding: "5px 14px", fontFamily: "var(--font-inter)",
      fontSize: "12px", fontWeight: 500, color: "#8FA3C0",
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00C977" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {label}
    </span>
  );
}

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────
function Section({ children, bg = "#080D17", style = {} }: {
  children: React.ReactNode;
  bg?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section style={{ backgroundColor: bg, padding: "80px 0", ...style }}>
      <div style={S.container}>{children}</div>
    </section>
  );
}

// ─── PHONE MOCKUP ─────────────────────────────────────────────────────────────
function PhoneMockup() {
  return (
    <div className="phone-float" style={{
      width: "280px", minHeight: "520px",
      backgroundColor: "#0F1929",
      borderRadius: "32px",
      border: "2px solid #2A3F57",
      padding: "20px 16px",
      boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 40px rgba(0,168,89,0.06)",
      flexShrink: 0,
    }}>
      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", opacity: 0.5 }}>
        <span style={{ fontSize: "11px", color: "#8FA3C0" }}>9:41</span>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ width: "3px", height: `${6 + i * 2}px`, backgroundColor: "#8FA3C0", borderRadius: "1px" }} />
          ))}
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #1E2E42" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#F0F4FF", fontFamily: "var(--font-jakarta)" }}>
          Dhaka → Chittagong
        </div>
        <div style={{ fontSize: "11px", color: "#8FA3C0", marginTop: "2px" }}>Thu 11 Jun · All Classes</div>
      </div>

      {/* Train card 1 */}
      <div style={{ ...S.card, padding: "12px", marginBottom: "8px", borderLeft: "3px solid #00A859", borderRadius: "8px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#F0F4FF", fontFamily: "var(--font-jakarta)" }}>
          Subarna Express #721
        </div>
        <div style={{ fontSize: "12px", color: "#F0F4FF", fontFamily: "monospace", margin: "4px 0" }}>
          06:40 ──── 11:15 (4h 35m)
        </div>
        <div style={{
          display: "inline-block", fontSize: "10px", fontWeight: 600,
          backgroundColor: "rgba(232,57,75,0.12)", color: "#E8394B",
          padding: "2px 8px", borderRadius: "4px", marginBottom: "6px",
        }}>
          ⚠ 15 min delay
        </div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {["S_CHAIR", "SNIGDHA", "AC_BERTH"].map((c) => (
            <span key={c} style={{
              fontSize: "9px", fontWeight: 600, padding: "2px 6px",
              backgroundColor: "rgba(0,168,89,0.1)", color: "#00A859",
              borderRadius: "4px",
            }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Train card 2 */}
      <div style={{ ...S.card, padding: "12px", marginBottom: "12px", borderLeft: "3px solid #00C977", borderRadius: "8px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#F0F4FF", fontFamily: "var(--font-jakarta)" }}>
          Sonar Bangla #787
        </div>
        <div style={{ fontSize: "12px", color: "#F0F4FF", fontFamily: "monospace", margin: "4px 0" }}>
          07:00 ──── 12:00 (5h 00m)
        </div>
        <div style={{
          display: "inline-block", fontSize: "10px", fontWeight: 600,
          backgroundColor: "rgba(0,201,119,0.1)", color: "#00C977",
          padding: "2px 8px", borderRadius: "4px",
        }}>
          ✓ On time
        </div>
      </div>

      {/* Live report */}
      <div style={{
        backgroundColor: "#1A2840", borderRadius: "8px", padding: "10px 12px",
        display: "flex", alignItems: "center", gap: "8px",
        border: "1px solid rgba(232,57,75,0.2)",
        animation: "float 3s ease-in-out infinite",
      }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#E8394B", flexShrink: 0 }} />
        <span style={{ fontSize: "10px", color: "#8FA3C0", fontFamily: "var(--font-inter)" }}>
          8 travelers confirm delay on Subarna
        </span>
      </div>
    </div>
  );
}

// ─── REPORT CARD ──────────────────────────────────────────────────────────────
function ReportCard({ color, badge, badgeColor, badgeBg, train, detail, confirmed }: {
  color: string; badge: string; badgeColor: string; badgeBg: string;
  train: string; detail: string; confirmed: string;
}) {
  return (
    <div className="report-card" style={{
      backgroundColor: "#162035",
      border: "1px solid #1E2E42",
      borderLeft: `3px solid ${color}`,
      borderRadius: "12px", padding: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{
          fontSize: "10px", fontWeight: 700, padding: "3px 8px",
          backgroundColor: badgeBg, color: badgeColor, borderRadius: "4px",
        }}>
          {badge}
        </span>
      </div>
      <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 600, fontSize: "14px", color: "#F0F4FF", marginBottom: "4px" }}>
        {train}
      </div>
      <div style={{ fontSize: "12px", color: "#8FA3C0", marginBottom: "6px" }}>{detail}</div>
      <div style={{ fontSize: "11px", color: "#00C977" }}>✓ {confirmed}</div>
    </div>
  );
}

// ─── FEATURE CARD ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, body, tag, tagColor, tagBg }: {
  icon: React.ReactNode; title: string; body: string;
  tag: string; tagColor: string; tagBg: string;
}) {
  return (
    <div className="feature-card" style={S.card}>
      <div style={{ marginBottom: "16px" }}>{icon}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "16px", color: "#F0F4FF" }}>
          {title}
        </div>
        <span style={{
          fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px",
          color: tagColor, backgroundColor: tagBg,
        }}>{tag}</span>
      </div>
      <p style={{ ...S.body, fontSize: "14px", lineHeight: 1.6 }}>{body}</p>
    </div>
  );
}

// ─── PAIN CARD ────────────────────────────────────────────────────────────────
function PainCard({ iconColor, iconBg, borderColor, icon, title, body }: {
  iconColor: string; iconBg: string; borderColor: string;
  icon: React.ReactNode; title: string; body: string;
}) {
  return (
    <div style={{
      backgroundColor: iconBg, border: `1px solid ${borderColor}`,
      borderRadius: "16px", padding: "28px 24px",
    }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "12px",
        backgroundColor: iconBg, display: "flex", alignItems: "center",
        justifyContent: "center", marginBottom: "16px",
        border: `1px solid ${borderColor}`,
      }}>
        {icon}
      </div>
      <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "17px", color: "#F0F4FF", marginBottom: "10px" }}>
        {title}
      </div>
      <p style={{ ...S.body, fontSize: "14px" }}>{body}</p>
    </div>
  );
}

// ─── STAT BLOCK ───────────────────────────────────────────────────────────────
function StatBlock({ number, label }: { number: string; label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "0 24px" }}>
      <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 48px)", color: "#00A859", lineHeight: 1 }}>
        {number}
      </div>
      <div style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "#8FA3C0", marginTop: "6px" }}>
        {label}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="hero-glow grid-overlay"
        style={{ backgroundColor: "#080D17", paddingTop: "120px", paddingBottom: "80px", minHeight: "100vh" }}
      >
        <div style={{ ...S.container, display: "flex", alignItems: "center", gap: "48px", flexWrap: "wrap" }}>

          {/* Left */}
          <div style={{ flex: "1 1 520px", minWidth: "280px" }}>
            <span style={S.overline}>🇧🇩 Bangladesh&apos;s #1 Railway Companion App</span>

            <h1 style={S.h1}>
              Your Railway,<br />
              <span style={{ color: "#F0F4FF" }}>Simplified</span>
              <span style={{ color: "#00A859" }}>.</span>
            </h1>

            <p style={{
              fontFamily: "var(--font-bengali)", fontSize: "18px",
              color: "#8FA3C0", lineHeight: 1.7, marginBottom: "16px",
            }}>
              আপনার রেলযাত্রা, সহজ করা হলো।
            </p>

            <p style={{ ...S.body, fontSize: "17px", maxWidth: "520px", marginBottom: "24px" }}>
              Stop using 3 different apps just to catch one train. RailMate gives you
              real schedules, real fares, and live delay reports from fellow travelers —
              all in one place. <strong style={{ color: "#F0F4FF" }}>Free.</strong>
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
              <TrustBadge label="Free Forever" />
              <TrustBadge label="Bengali + English" />
              <TrustBadge label="Works Offline" />
            </div>

            <DownloadButtons />

            <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "#4E6480", marginTop: "12px" }}>
              App Store version coming soon · Free · Android 7.0+
            </p>
          </div>

          {/* Right — Phone mockup (hidden on small screens) */}
          <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }} className="hidden lg:flex">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────────────── */}
      <Section bg="#0F1929">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={S.h2}>Sound familiar?</h2>
          <p style={{ ...S.body, maxWidth: "520px", margin: "0 auto" }}>
            Every Bangladesh train traveler knows these problems.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          <PainCard
            iconColor="#E8394B" iconBg="rgba(232,57,75,0.06)" borderColor="rgba(232,57,75,0.2)"
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8394B" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
            title="Is my train even on time?"
            body="You leave home, reach the station, then find out your train is 45 minutes late. No app warned you. No one knew."
          />
          <PainCard
            iconColor="#F5A623" iconBg="rgba(245,166,35,0.06)" borderColor="rgba(245,166,35,0.2)"
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
            title="3 apps for 1 journey"
            body="BR website for schedules. Shohoz for tickets. WhatsApp groups for delays. There's no single place that does everything."
          />
          <PainCard
            iconColor="#4EA8E0" iconBg="rgba(78,168,224,0.06)" borderColor="rgba(78,168,224,0.2)"
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4EA8E0" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
            title="What does this ticket cost?"
            body="Fare tables are buried in PDFs. Prices vary by class and season. Nobody tells you Snigdha isn't available on this route."
          />
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "20px", color: "#00A859" }}>
            RailMate fixes all three. For free.
          </p>
        </div>
      </Section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section id="features" style={{ backgroundColor: "#080D17", padding: "80px 0" }}>
        <div style={S.container}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={S.overline}>What RailMate Does</span>
            <h2 style={S.h2}>Everything for your journey.<br />Nothing you don&apos;t need.</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <FeatureCard
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00A859" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>}
              title="Train Schedules" tag="FREE" tagColor="#00A859" tagBg="rgba(0,168,89,0.1)"
              body="Full timetables for all Bangladesh Railway intercity routes. Updated when BR updates. Always shows last-verified date."
            />
            <FeatureCard
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00A859" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>}
              title="Fare Calculator" tag="FREE" tagColor="#00A859" tagBg="rgba(0,168,89,0.1)"
              body="Exact fares for all 8 coach classes — Shovon to AC Berth. Pick your route, pick your class. No more PDF digging."
            />
            <FeatureCard
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>}
              title="Live Delay Reports" tag="FREE" tagColor="#00A859" tagBg="rgba(0,168,89,0.1)"
              body="Fellow travelers report delays, crowding, and coach conditions in real time. Know what's happening before you leave home."
            />
            <FeatureCard
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00A859" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>}
              title="Departure Alerts" tag="PRO" tagColor="#F5A623" tagBg="rgba(245,166,35,0.1)"
              body="Push notification before your train departs. Never miss your Dhaka–Chittagong express again. Unlimited alerts with Pro."
            />
            <FeatureCard
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00A859" strokeWidth="1.8"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0119 12.55"/><path d="M5 12.55a10.94 10.94 0 015.17-2.39"/><path d="M10.71 5.05A16 16 0 0122.56 9"/><path d="M1.42 9a15.91 15.91 0 014.7-2.88"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>}
              title="Offline Access" tag="PRO" tagColor="#F5A623" tagBg="rgba(245,166,35,0.1)"
              body="Full schedule data cached on your device. Works in stations with no signal. Works on overnight journeys with no data."
            />
            <FeatureCard
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00A859" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>}
              title="Bengali & English" tag="FREE" tagColor="#00A859" tagBg="rgba(0,168,89,0.1)"
              body="Station names, train names, all UI in both languages. Switch any time. Noto Sans Bengali for proper rendering."
            />
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ────────────────────────────────────────────────────────── */}
      <section id="community" style={{ backgroundColor: "#0F1929", padding: "80px 0" }}>
        <div style={{ ...S.container, display: "flex", gap: "64px", flexWrap: "wrap", alignItems: "center" }}>

          {/* Left */}
          <div style={{ flex: "1 1 400px", minWidth: "280px" }}>
            <span style={S.overline}>Community Intelligence</span>
            <h2 style={S.h2}>Real Reports.<br />Real Travelers.</h2>
            <p style={{ ...S.body, marginBottom: "16px" }}>
              No government API. No paid data feed. Just thousands of Bangladeshi
              train passengers telling each other what&apos;s actually happening right now.
            </p>
            <p style={{ ...S.body, marginBottom: "40px" }}>
              When Subarna Express leaves Comilla 20 minutes late, someone on that
              train reports it. Within seconds, everyone waiting at Chittagong knows.
            </p>

            {[
              { number: "8+", label: "travelers confirmed a delay this morning" },
              { number: "< 3 min", label: "average time from event to report" },
              { number: "Free", label: "community features cost nothing" },
            ].map(({ number, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "20px" }}>
                <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "28px", color: "#00A859" }}>
                  {number}
                </span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "#8FA3C0" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Right — report feed */}
          <div style={{ flex: "1 1 300px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <ReportCard
              color="#E8394B" badge="⚠ DELAY" badgeColor="#E8394B" badgeBg="rgba(232,57,75,0.12)"
              train="Subarna Express #721"
              detail="Delayed 20 min at Comilla · Reported 3 min ago"
              confirmed="12 travelers confirmed this"
            />
            <ReportCard
              color="#F5A623" badge="🟡 CROWDING" badgeColor="#F5A623" badgeBg="rgba(245,166,35,0.12)"
              train="Turna Express · Dhaka-bound"
              detail="Very High · Coach 3–5 overcrowded"
              confirmed="8 confirmed"
            />
            <ReportCard
              color="#00C977" badge="✅ ON TIME" badgeColor="#00C977" badgeBg="rgba(0,201,119,0.12)"
              train="Sonar Bangla Express #787"
              detail="Running on schedule"
              confirmed="25 confirmations"
            />
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <Section bg="#080D17">
        <div style={{
          display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0",
          borderRadius: "16px", border: "1px solid #1E2E42",
          backgroundColor: "#0F1929", padding: "40px 0",
        }}>
          {[
            { number: "100+", label: "Train Routes Covered" },
            { number: "500+", label: "Stations Searchable" },
            { number: "8", label: "Coach Classes Supported" },
            { number: "Free", label: "Core Features, Always" },
          ].map(({ number, label }, i, arr) => (
            <div key={label} style={{
              flex: "1 1 160px", padding: "0 24px",
              borderRight: i < arr.length - 1 ? "1px solid #1E2E42" : "none",
              textAlign: "center",
            }}>
              <StatBlock number={number} label={label} />
            </div>
          ))}
        </div>

        {/* Data notice */}
        <div style={{
          maxWidth: "720px", margin: "32px auto 0",
          backgroundColor: "rgba(245,166,35,0.06)",
          border: "1px solid rgba(245,166,35,0.2)",
          borderRadius: "10px", padding: "16px 20px",
          display: "flex", gap: "12px", alignItems: "flex-start",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#8FA3C0", lineHeight: 1.6, margin: 0 }}>
            Schedule data sourced from Bangladesh Railway official publications (railway.gov.bd) and community-verified.
            Always confirm critical journeys with official sources. Live delay data is community-reported.
          </p>
        </div>
      </Section>

      {/* ── PRO UPGRADE ──────────────────────────────────────────────────────── */}
      <Section bg="#0F1929">
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <span style={S.overline}>RailMate Pro</span>
          <h2 style={S.h2}>Travel smarter.<br />Upgrade to Pro.</h2>
          <p style={{ ...S.body, marginBottom: "40px" }}>
            Core features are free forever. Pro unlocks the tools frequent travelers need.
          </p>

          <div style={{ overflowX: "auto", marginBottom: "40px" }}>
            <table className="compare-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr>
                  <th style={{ color: "#4E6480", backgroundColor: "#1A2840", padding: "12px 16px", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #1E2E42" }}>Feature</th>
                  <th style={{ color: "#4E6480", backgroundColor: "#1A2840", padding: "12px 16px", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #1E2E42", textAlign: "center" }}>Free</th>
                  <th style={{ color: "#F5A623", backgroundColor: "rgba(245,166,35,0.06)", padding: "12px 16px", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #1E2E42", textAlign: "center" }}>👑 Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Train schedules & fares", "✓", "✓"],
                  ["Community reports", "✓", "✓"],
                  ["Saved routes", "3 max", "Unlimited"],
                  ["Departure alerts", "1/day", "Unlimited"],
                  ["Delay notifications", "—", "✓"],
                  ["Offline schedule access", "—", "✓"],
                  ["Home screen widgets", "—", "✓"],
                  ["Ad-free experience", "—", "✓"],
                ].map(([feature, free, pro], i) => (
                  <tr key={feature} style={{ backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #1E2E42", color: "#8FA3C0", fontSize: "14px" }}>{feature}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #1E2E42", textAlign: "center", fontSize: "14px", color: free === "✓" ? "#00C977" : "#4E6480" }}>{free}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #1E2E42", textAlign: "center", fontSize: "14px", color: pro === "✓" || pro === "Unlimited" ? "#F5A623" : "#4E6480", backgroundColor: "rgba(245,166,35,0.03)", fontWeight: pro === "—" ? 400 : 600 }}>{pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
            <div style={{ ...S.card, padding: "24px 32px", textAlign: "center", minWidth: "160px" }}>
              <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "28px", color: "#F0F4FF" }}>৳99</div>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#8FA3C0", marginTop: "4px" }}>per month</div>
            </div>
            <div style={{
              ...S.card, padding: "24px 32px", textAlign: "center", minWidth: "160px",
              border: "2px solid #F5A623", backgroundColor: "rgba(245,166,35,0.05)",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                backgroundColor: "#F5A623", color: "#080D17",
                fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "10px",
                padding: "3px 12px", borderRadius: "9999px", whiteSpace: "nowrap",
              }}>
                BEST VALUE
              </div>
              <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "28px", color: "#F5A623" }}>৳799</div>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#F5A623", marginTop: "4px" }}>per year · Save 33%</div>
            </div>
          </div>

          <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#4E6480", marginBottom: "20px" }}>
            7-day free trial · Cancel anytime · No commitment
          </p>

          <a href="#download" style={{ ...S.btnPrimary, justifyContent: "center", width: "100%", maxWidth: "320px" }}>
            Start 7-Day Free Trial →
          </a>
        </div>
      </Section>

      {/* ── DOWNLOAD CTA ─────────────────────────────────────────────────────── */}
      <section id="download" style={{ backgroundColor: "#080D17", padding: "100px 0" }}>
        <div style={{ ...S.container, textAlign: "center", maxWidth: "680px" }}>
          <span style={S.overline}>Download Free Today</span>
          <h2 style={{ ...S.h2, fontSize: "clamp(32px, 5vw, 48px)" }}>
            Stop guessing.<br />Start knowing.
          </h2>
          <p style={{ ...S.body, fontSize: "17px", maxWidth: "500px", margin: "0 auto 32px" }}>
            Join Bangladeshi travelers who check RailMate before every train journey.
            Know if your train is late before you leave home.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
            <a href="#" style={S.btnPrimary}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/></svg>
              Download on Google Play
            </a>
            <a href="#" style={S.btnSecondary}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.32.07 2.22.74 2.98.8 1.11-.22 2.18-.91 3.39-.84 1.44.07 2.52.6 3.22 1.53-2.9 1.74-2.22 5.56.44 6.62-.52 1.39-1.2 2.76-2.03 4.77zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Download APK
            </a>
          </div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "#4E6480", marginBottom: "32px" }}>
            Android 7.0+ required · iOS coming soon · 100% free to download
          </p>
          <p style={{ fontFamily: "var(--font-bengali)", fontSize: "18px", color: "#4E6480", lineHeight: 1.7 }}>
            আপনার রেলযাত্রা, সহজ করা হলো।
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: "#0F1929", borderTop: "1px solid #1E2E42", padding: "48px 0 28px" }}>
        <div style={{ ...S.container, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "40px", marginBottom: "40px" }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "7px", backgroundColor: "#00A859", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="7" width="16" height="2" rx="1" fill="white" opacity="0.9" />
                  <rect x="2" y="11" width="16" height="2" rx="1" fill="white" opacity="0.9" />
                  <path d="M14 5 L18 10 L14 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
              <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "15px", color: "#F0F4FF" }}>RailMate</span>
            </div>
            <p style={{ fontFamily: "var(--font-bengali)", fontSize: "14px", color: "#4E6480", lineHeight: 1.7, marginBottom: "16px" }}>
              আপনার রেলযাত্রা, সহজ করা হলো।
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { label: "Facebook", href: "https://facebook.com/railmatebd" },
                { label: "Twitter", href: "https://twitter.com/railmatebd" },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "#4E6480", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00A859")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#4E6480")}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <div style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4E6480", marginBottom: "16px" }}>
              Product
            </div>
            {["Home", "Features", "Download", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "14px", color: "#8FA3C0", textDecoration: "none", marginBottom: "10px" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F4FF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8FA3C0")}
              >{item}</a>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4E6480", marginBottom: "16px" }}>
              Legal
            </div>
            {[["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"], ["Copyright Notice", "/copyright"]].map(([label, href]) => (
              <a key={label} href={href}
                style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "14px", color: "#8FA3C0", textDecoration: "none", marginBottom: "10px" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F0F4FF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8FA3C0")}
              >{label}</a>
            ))}
          </div>

          {/* Data notice */}
          <div>
            <div style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4E6480", marginBottom: "16px" }}>
              Data Sources
            </div>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#4E6480", lineHeight: 1.6 }}>
              Schedule data sourced from Bangladesh Railway official publications.
              Community reports are user-submitted. RailMate is not affiliated with Bangladesh Railway.
            </p>
            <a href="https://railway.gov.bd" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "#00A859", textDecoration: "none", marginTop: "8px", display: "inline-block" }}>
              railway.gov.bd →
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid #1E2E42", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#4E6480" }}>
            © 2025 RailMate Bangladesh. All rights reserved.
          </p>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "#4E6480" }}>
            Built with ❤️ in Bangladesh.
          </p>
        </div>
      </footer>
    </>
  );
}
