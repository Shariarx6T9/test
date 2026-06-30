import { useState } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:         "#0A0A0A",
  card:       "#111811",
  cardBorder: "rgba(34,197,94,0.10)",
  green:      "#22C55E",
  greenDim:   "rgba(34,197,94,0.15)",
  greenBorder:"rgba(34,197,94,0.40)",
  iconBg:     "#0D2218",
  white:      "#FFFFFF",
  gray1:      "#9CA3AF",
  gray2:      "#6B7280",
  sep:        "rgba(255,255,255,0.08)",
  navBg:      "#0D0D0D",
};

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function RailMateApp() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      gap: 40,
      padding: "36px 24px 48px",
      flexWrap: "wrap",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Bengali", sans-serif',
    }}>
      <PhoneFrame label="Screen 1 — Onboarding">
        <OnboardingScreen />
      </PhoneFrame>
      <PhoneFrame label="Screen 2 — Search Trains">
        <SearchScreen />
      </PhoneFrame>
    </div>
  );
}

function PhoneFrame({ children, label }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
      <span style={{ color:"#444", fontSize:10, fontFamily:"monospace", letterSpacing:"0.12em", textTransform:"uppercase" }}>
        {label}
      </span>
      <div style={{
        width: 390, height: 844,
        borderRadius: 52,
        overflow: "hidden",
        background: "#000",
        boxShadow: "0 0 0 2px #252525, 0 0 0 13px #161616, 0 48px 96px rgba(0,0,0,0.9)",
        position: "relative",
        flexShrink: 0,
      }}>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SCREEN 1 — ONBOARDING
   ═══════════════════════════════════════════════════════════════════════════════ */
function OnboardingScreen() {
  return (
    <div style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden", background:"#020407" }}>
      {/* ── BACKGROUND ILLUSTRATION ── */}
      <OnboardingBg />

      {/* ── CONTENT LAYER ── */}
      <div style={{
        position:"absolute", inset:0,
        display:"flex", flexDirection:"column", alignItems:"center",
      }}>
        {/* Status bar spacer */}
        <div style={{ height: 52 }} />

        {/* ── LOGO PIN ── */}
        <div style={{ marginTop: 62 }}>
          <LogoPin />
        </div>

        {/* ── HEADLINE ── */}
        <div style={{ marginTop: 30, textAlign:"center", paddingLeft:24, paddingRight:24 }}>
          <div style={{ fontSize:40, fontWeight:800, color:C.white, lineHeight:1.12, letterSpacing:"-0.8px" }}>
            Travel Smarter.
          </div>
          <div style={{ fontSize:40, fontWeight:800, lineHeight:1.12, letterSpacing:"-0.8px" }}>
            <span style={{ color:C.white }}>Travel </span>
            <span style={{ color:C.green }}>RailMate.</span>
          </div>
        </div>

        {/* ── SUBTITLE ── */}
        <div style={{
          marginTop: 14,
          fontSize: 16,
          color: "rgba(180,200,185,0.85)",
          textAlign: "center",
          lineHeight: 1.55,
          paddingLeft: 52,
          paddingRight: 52,
        }}>
          Your all-in-one railway companion<br />for Bangladesh.
        </div>

        {/* flex spacer — pushes buttons to bottom */}
        <div style={{ flex: 1 }} />

        {/* ── BUTTONS ── */}
        <div style={{ width:"100%", paddingLeft:24, paddingRight:24 }}>
          {/* Get Started */}
          <div style={{
            background: C.green,
            borderRadius: 32,
            height: 58,
            display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative",
            boxShadow: "0 6px 28px rgba(34,197,94,0.38)",
          }}>
            <span style={{ fontSize:18, fontWeight:600, color:C.white, letterSpacing:"-0.2px" }}>
              Get Started
            </span>
            <span style={{
              position:"absolute", right:24,
              fontSize:22, color:C.white, fontWeight:300,
            }}>→</span>
          </div>

          {/* Continue in বাংলা */}
          <div style={{
            marginTop: 12,
            border: `1.5px solid ${C.greenBorder}`,
            borderRadius: 32,
            height: 52,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <span style={{ fontSize:16, fontWeight:500, color:C.green }}>
              Continue in বাংলা
            </span>
          </div>
        </div>

        {/* ── PAGINATION DOTS ── */}
        <div style={{ display:"flex", gap:7, alignItems:"center", marginTop:26, marginBottom:38 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              width:  i === 0 ? 22 : 8,
              height: 8,
              borderRadius: 4,
              background: i === 0 ? C.green : "#363636",
              transition: "all 0.2s",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Logo Pin ── */
function LogoPin() {
  return (
    <svg width="88" height="108" viewBox="0 0 88 108" fill="none">
      {/* Drop shadow */}
      <ellipse cx="44" cy="105" rx="16" ry="4" fill="rgba(0,0,0,0.35)" />
      {/* Outer pin body */}
      <path
        d="M44 2C22.5 2 5 19.5 5 41C5 65 44 106 44 106C44 106 83 65 83 41C83 19.5 65.5 2 44 2Z"
        fill="url(#pGrad)"
      />
      {/* Dark inner circle */}
      <circle cx="44" cy="40" r="28" fill="#0A1A0A" />
      {/* Train icon inside */}
      <TrainFaceIcon cx={44} cy={40} />
      <defs>
        <linearGradient id="pGrad" x1="44" y1="2" x2="44" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#5AE87A" />
          <stop offset="100%" stopColor="#15A347" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TrainFaceIcon({ cx, cy }) {
  const x = cx - 16, y = cy - 18;
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Body */}
      <rect x="2" y="0" width="28" height="22" rx="4" fill="white" />
      {/* Left window */}
      <rect x="5" y="3" width="9" height="7" rx="2" fill="#0A1A0A" />
      {/* Right window */}
      <rect x="18" y="3" width="9" height="7" rx="2" fill="#0A1A0A" />
      {/* Red centre dot / headlight marker */}
      <circle cx="16" cy="16" r="4.5" fill="#EF4444" />
      {/* Track lines */}
      <rect x="0"  y="24" width="32" height="2"  rx="1" fill="rgba(255,255,255,0.45)" />
      <rect x="7"  y="22" width="2"  height="6"  rx="1" fill="rgba(255,255,255,0.45)" />
      <rect x="23" y="22" width="2"  height="6"  rx="1" fill="rgba(255,255,255,0.45)" />
    </g>
  );
}

/* ── Atmospheric Background ── */
function OnboardingBg() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
      {/* Base dark gradient */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(180deg,#020508 0%,#030D0A 18%,#071E14 36%,#071A11 52%,#041009 68%,#020709 82%,#010305 100%)",
      }} />
      {/* Atmospheric glow blob */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 110% 60% at 50% 58%, rgba(8,40,24,0.72) 0%,rgba(4,22,14,0.55) 35%,transparent 62%)",
      }} />
      {/* Secondary side glow */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 70% 45% at 20% 55%, rgba(4,20,12,0.5) 0%,transparent 55%)",
      }} />
      {/* SVG illustration */}
      <svg
        style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ── Stars ── */}
        {[
          [318,52,1.4],[348,34,1],[364,72,1.6],[325,22,0.9],[382,48,1.1],
          [355,95,1.3],[304,84,1],[374,118,0.9],[335,62,1.2],[292,45,1],
          [312,108,1.1],[352,28,0.8],[388,85,1],[298,125,1.2],[341,138,0.9],[370,158,1],
        ].map(([sx,sy,r],i) => (
          <circle key={i} cx={sx} cy={sy} r={r} fill={`rgba(255,255,255,${0.4+i*0.02})`} />
        ))}

        {/* ── Left city silhouette ── */}
        <g fill="#021008">
          <rect x="-12" y="145" width="22" height="265" />
          <rect x="6"   y="190" width="32" height="215" />
          <rect x="34"  y="165" width="18" height="240" />
          <rect x="46"  y="215" width="26" height="190" />
          <rect x="68"  y="248" width="14" height="157" />
          <rect x="78"  y="278" width="20" height="127" />
          <rect x="94"  y="295" width="16" height="110" />
        </g>
        {/* Left building lights */}
        <rect x="12"  y="205" width="6" height="4" fill="rgba(255,190,40,0.28)" rx="1" />
        <rect x="22"  y="228" width="6" height="4" fill="rgba(255,190,40,0.22)" rx="1" />
        <rect x="39"  y="182" width="6" height="4" fill="rgba(255,190,40,0.26)" rx="1" />
        <rect x="52"  y="235" width="6" height="4" fill="rgba(255,190,40,0.20)" rx="1" />

        {/* ── Right city silhouette ── */}
        <g fill="#021008">
          <rect x="332" y="135" width="28"  height="275" />
          <rect x="356" y="175" width="48"  height="235" />
          <rect x="342" y="218" width="20"  height="187" />
          <rect x="316" y="258" width="22"  height="147" />
          <rect x="295" y="288" width="24"  height="117" />
          <rect x="278" y="315" width="18"  height="90"  />
        </g>
        {/* Right building lights */}
        <rect x="340" y="190" width="6" height="4" fill="rgba(255,190,40,0.24)" rx="1" />
        <rect x="362" y="208" width="6" height="4" fill="rgba(255,190,40,0.20)" rx="1" />
        <rect x="322" y="272" width="6" height="4" fill="rgba(255,190,40,0.22)" rx="1" />

        {/* ── Bridge / overpass ── */}
        <path d="M 40 445 Q 195 398 350 445" stroke="#021A0C" fill="none" strokeWidth="26" />
        <path d="M 40 445 Q 195 398 350 445" stroke="#031608" fill="none" strokeWidth="14" />
        <rect x="98"  y="444" width="10" height="85" fill="#021A0C" />
        <rect x="282" y="444" width="10" height="85" fill="#021A0C" />

        {/* ── Railroad tracks (perspective) ── */}
        {/* Left rail */}
        <line x1="162" y1="844" x2="140" y2="510" stroke="#7A5F12" strokeWidth="3.5" />
        {/* Right rail */}
        <line x1="228" y1="844" x2="250" y2="510" stroke="#7A5F12" strokeWidth="3.5" />
        {/* Sleepers */}
        {[525,565,605,645,685,725,765,805,844].map((ry,i) => {
          const t = (ry - 510) / 334;
          const lx = 140 + t * 22;
          const rx = 250 - t * 22;
          return (
            <line key={i} x1={lx} y1={ry} x2={rx} y2={ry}
              stroke="#5A4510" strokeWidth="2.5" strokeLinecap="round" />
          );
        })}
        {/* Track center highlight */}
        <line x1="195" y1="844" x2="195" y2="530" stroke="rgba(180,140,30,0.25)" strokeWidth="1.5" strokeDasharray="6,8" />

        {/* ── Train (front-on) ── */}
        <g transform="translate(148,458)">
          {/* Main body */}
          <rect x="0"  y="0"  width="84" height="58" rx="6"  fill="#0B1E0E" />
          {/* Front face panel */}
          <rect x="5"  y="5"  width="74" height="44" rx="4"  fill="#112A14" />
          {/* Left window */}
          <rect x="12" y="10" width="22" height="16" rx="2.5" fill="#183520" />
          {/* Right window */}
          <rect x="50" y="10" width="22" height="16" rx="2.5" fill="#183520" />
          {/* Green stripe */}
          <rect x="5"  y="28" width="74" height="5"  fill="rgba(34,197,94,0.22)" />
          {/* Left headlight */}
          <circle cx="23" cy="38" r="7"  fill="rgba(255,210,80,0.88)" />
          <circle cx="23" cy="38" r="12" fill="rgba(255,200,50,0.12)" />
          {/* Right headlight */}
          <circle cx="61" cy="38" r="7"  fill="rgba(255,210,80,0.88)" />
          <circle cx="61" cy="38" r="12" fill="rgba(255,200,50,0.12)" />
          {/* Bottom beam */}
          <rect x="0"  y="56" width="84" height="6"  rx="2" fill="#080F09" />
        </g>

        {/* Headlight glow on track */}
        <ellipse cx="195" cy="530" rx="55" ry="18" fill="rgba(255,200,50,0.07)" />

        {/* ── Bottom fade-to-black ── */}
        <defs>
          <linearGradient id="bFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#010305" stopOpacity="0"    />
            <stop offset="50%"  stopColor="#010305" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#010305" stopOpacity="1"    />
          </linearGradient>
        </defs>
        <rect x="0" y="580" width="390" height="264" fill="url(#bFade)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SCREEN 2 — SEARCH TRAINS
   ═══════════════════════════════════════════════════════════════════════════════ */
function SearchScreen() {
  return (
    <div style={{
      width:"100%", height:"100%",
      background: C.bg,
      display:"flex", flexDirection:"column",
      overflow:"hidden",
    }}>
      <StatusBar />
      <SearchHeader />

      {/* Scrollable body */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom:4 }}>
        {/* Search form card */}
        <div style={{ padding:"12px 16px 0" }}>
          <SearchFormCard />
        </div>
        {/* Search CTA */}
        <div style={{ padding:"12px 16px 0" }}>
          <SearchCTA />
        </div>
        {/* Recent searches */}
        <div style={{ padding:"18px 16px 0" }}>
          <RecentSearchesSection />
        </div>
        {/* Promo card */}
        <div style={{ padding:"8px 16px 12px" }}>
          <PromoCard />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

/* ── Status Bar ── */
function StatusBar() {
  return (
    <div style={{
      height:44, display:"flex", alignItems:"center",
      justifyContent:"space-between",
      paddingLeft:20, paddingRight:16, paddingTop:10,
    }}>
      <span style={{ color:C.white, fontSize:15, fontWeight:600, letterSpacing:"-0.3px" }}>9:41</span>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {/* Signal */}
        <svg width="18" height="12" viewBox="0 0 18 12">
          <rect x="0"  y="8" width="3" height="4" rx="0.5" fill="white" />
          <rect x="5"  y="5" width="3" height="7" rx="0.5" fill="white" />
          <rect x="10" y="2" width="3" height="10" rx="0.5" fill="white" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" fill="white" />
        </svg>
        {/* WiFi */}
        <svg width="17" height="13" viewBox="0 0 17 13">
          <circle cx="8.5" cy="11.5" r="1.5" fill="white" />
          <path d="M5.5 8.5 Q8.5 6 11.5 8.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M2.5 5.5 Q8.5 1.5 14.5 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
        {/* Battery */}
        <div style={{ display:"flex", alignItems:"center" }}>
          <div style={{
            width:27, height:14, border:"1.5px solid rgba(255,255,255,0.7)", borderRadius:3.5,
            padding:1.5, display:"flex",
          }}>
            <div style={{ flex:1, background:"white", borderRadius:1.5 }} />
          </div>
          <div style={{ width:2, height:7, background:"rgba(255,255,255,0.7)", borderRadius:"0 1px 1px 0", marginLeft:-1 }} />
        </div>
        <span style={{ color:C.white, fontSize:12, fontWeight:500 }}>100</span>
      </div>
    </div>
  );
}

/* ── Search Header ── */
function SearchHeader() {
  return (
    <div style={{
      height:52, display:"flex", alignItems:"center",
      paddingLeft:16, paddingRight:16, position:"relative",
    }}>
      {/* Back button */}
      <div style={{
        width:36, height:36, borderRadius:18,
        background:"rgba(255,255,255,0.07)",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
          <path d="M8 1L1.5 8L8 15" stroke="white" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* Title */}
      <span style={{
        position:"absolute", left:"50%", transform:"translateX(-50%)",
        color:C.white, fontSize:17, fontWeight:600, letterSpacing:"-0.3px",
      }}>Search Trains</span>
      {/* Recent pill */}
      <div style={{
        marginLeft:"auto",
        border:`1.5px solid ${C.green}`,
        borderRadius:16, height:32,
        paddingLeft:10, paddingRight:12,
        display:"flex", alignItems:"center", gap:5,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke={C.green} strokeWidth="1.4" />
          <path d="M7 4V7.5L9.5 9" stroke={C.green} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span style={{ color:C.green, fontSize:13, fontWeight:500 }}>Recent</span>
      </div>
    </div>
  );
}

/* ── Search Form Card ── */
function SearchFormCard() {
  return (
    <div style={{
      background:C.card, borderRadius:16,
      border:`1px solid ${C.cardBorder}`,
      overflow:"hidden",
    }}>

      {/* ── FROM ── */}
      <div style={{ padding:"14px 16px 10px", position:"relative" }}>
        <div style={{ display:"flex", alignItems:"stretch", gap:12 }}>
          {/* Left col: pin + dashed connector */}
          <div style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            width:20, flexShrink:0, paddingTop:18,
          }}>
            <LocationPin />
            <div style={{
              flex:1, marginTop:5,
              borderLeft:"1.5px dashed rgba(255,255,255,0.22)",
              minHeight:28,
            }} />
          </div>
          {/* Station info */}
          <div style={{ flex:1, paddingTop:4 }}>
            <div style={{ fontSize:12, color:C.gray1, marginBottom:1 }}>From</div>
            <div style={{ fontSize:21, fontWeight:700, color:C.white, lineHeight:1.15 }}>Dhaka</div>
            <div style={{ fontSize:13, color:C.gray2, marginTop:1 }}>ঢাকা</div>
            <div style={{ fontSize:13, color:C.green, marginTop:2 }}>Kamlapur Railway Station</div>
          </div>
          {/* Clear button */}
          <XBtn mt={20} />
        </div>
      </div>

      {/* ── SEPARATOR + SWAP ── */}
      <div style={{ position:"relative" }}>
        <div style={{ height:1, background:C.sep, marginLeft:16 }} />
        {/* Swap button overlaps separator on the right */}
        <div style={{
          position:"absolute", right:16, top:"50%",
          transform:"translateY(-50%)",
          width:36, height:36, borderRadius:18,
          background:"rgba(34,197,94,0.14)",
          border:`1.5px solid ${C.greenBorder}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:2,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 2v12M5 14l-3-3M5 14l3-3"
              stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 14V2M11 2l-3 3M11 2l3 3"
              stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── TO ── */}
      <div style={{ padding:"10px 16px 14px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
          <div style={{ paddingTop:18, flexShrink:0, width:20, display:"flex", justifyContent:"center" }}>
            <LocationPin />
          </div>
          <div style={{ flex:1, paddingTop:4 }}>
            <div style={{ fontSize:12, color:C.gray1, marginBottom:1 }}>To</div>
            <div style={{ fontSize:21, fontWeight:700, color:C.white, lineHeight:1.15 }}>Chattogram</div>
            <div style={{ fontSize:13, color:C.gray2, marginTop:1 }}>চট্টগ্রাম</div>
            <div style={{ fontSize:13, color:C.green, marginTop:2 }}>Chattogram Railway Station</div>
          </div>
          <XBtn mt={20} />
        </div>
      </div>

      {/* ── Full-width separator ── */}
      <div style={{ height:1, background:C.sep }} />

      {/* ── DATE ROW ── */}
      <OptionRow
        icon={<CalendarIcon />}
        label="Date of Journey"
        value="Today, 18 June 2026"
        sub="বৃহস্পতিবার, ১৮ জুন ২০২৬"
      />
      <div style={{ height:1, background:C.sep, marginLeft:64 }} />

      {/* ── CLASS ROW ── */}
      <OptionRow
        icon={<SeatIcon />}
        label="Class (Optional)"
        value="All Classes"
        sub="All Available Classes"
      />
      <div style={{ height:1, background:C.sep, marginLeft:64 }} />

      {/* ── QUOTA ROW ── */}
      <OptionRow
        icon={<QuotaIcon />}
        label="Quota (Optional)"
        value="General"
        sub="General Quota"
      />
    </div>
  );
}

function LocationPin() {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill={C.green}>
      <path d="M10 0C5.58 0 2 3.58 2 8C2 14 10 24 10 24C10 24 18 14 18 8C18 3.58 14.42 0 10 0ZM10 10.5C8.62 10.5 7.5 9.38 7.5 8C7.5 6.62 8.62 5.5 10 5.5C11.38 5.5 12.5 6.62 12.5 8C12.5 9.38 11.38 10.5 10 10.5Z" />
    </svg>
  );
}

function XBtn({ mt = 0 }) {
  return (
    <div style={{
      width:28, height:28, borderRadius:6,
      background:"rgba(255,255,255,0.09)",
      display:"flex", alignItems:"center", justifyContent:"center",
      flexShrink:0, marginTop:mt,
    }}>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M1.5 1.5L9.5 9.5M9.5 1.5L1.5 9.5"
          stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function OptionRow({ icon, label, value, sub }) {
  return (
    <div style={{
      display:"flex", alignItems:"center",
      padding:"11px 16px", gap:12,
    }}>
      <div style={{
        width:40, height:40, borderRadius:10,
        background:C.iconBg,
        display:"flex", alignItems:"center", justifyContent:"center",
        flexShrink:0,
      }}>
        {icon}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:12, color:C.gray1, marginBottom:1 }}>{label}</div>
        <div style={{ fontSize:16, fontWeight:600, color:C.white, lineHeight:1.2 }}>{value}</div>
        <div style={{ fontSize:12, color:C.gray2, marginTop:1 }}>{sub}</div>
      </div>
      <svg width="7" height="13" viewBox="0 0 7 13" fill="none">
        <path d="M1 1L6 6.5L1 12" stroke={C.gray1} strokeWidth="1.7"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="14" rx="2" stroke={C.green} strokeWidth="1.4" />
      <path d="M6 2v3M14 2v3" stroke={C.green} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M2 8h16" stroke={C.green} strokeWidth="1.4" />
      <rect x="5"  y="11" width="3" height="3" rx="0.8" fill={C.green} />
      <rect x="9"  y="11" width="3" height="3" rx="0.8" fill={C.green} />
      <rect x="13" y="11" width="3" height="3" rx="0.8" fill={C.green} />
    </svg>
  );
}

function SeatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 5C5 3.9 5.9 3 7 3h6c1.1 0 2 .9 2 2v5H5V5Z"
        stroke={C.green} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M3 10h14v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3Z"
        stroke={C.green} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 15v2M13 15v2" stroke={C.green} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function QuotaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="5" width="16" height="11" rx="2" stroke={C.green} strokeWidth="1.4" />
      <circle cx="7" cy="10.5" r="2.2" stroke={C.green} strokeWidth="1.4" />
      <path d="M12 8.5h4M12 11h3" stroke={C.green} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ── Search CTA ── */
function SearchCTA() {
  return (
    <div style={{
      background:C.green, borderRadius:30, height:56,
      display:"flex", alignItems:"center", justifyContent:"center", gap:10,
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="8.5" cy="8.5" r="6" stroke="white" strokeWidth="2" />
        <path d="M13 13L17.5 17.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span style={{ color:C.white, fontSize:17, fontWeight:600, letterSpacing:"-0.2px" }}>
        Search Trains
      </span>
    </div>
  );
}

/* ── Recent Searches ── */
const RECENT = [
  { from:"Dhaka",      to:"Chattogram", date:"Today, 18 June 2026", cls:"All Classes"   },
  { from:"Dhaka",      to:"Sylhet",     date:"17 June 2026",        cls:"All Classes"   },
  { from:"Dhaka",      to:"Rajshahi",   date:"15 June 2026",        cls:"Shovon Chair"  },
  { from:"Chattogram", to:"Dhaka",      date:"14 June 2026",        cls:"All Classes"   },
];

function RecentSearchesSection() {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ color:C.white, fontSize:16, fontWeight:600 }}>Recent Searches</span>
        <span style={{ color:C.green, fontSize:14, fontWeight:500 }}>Clear All</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {RECENT.map((r,i) => <RecentItem key={i} {...r} />)}
      </div>
    </div>
  );
}

function RecentItem({ from, to, date, cls }) {
  return (
    <div style={{
      background:C.card, border:`1px solid ${C.cardBorder}`,
      borderRadius:12, padding:"11px 12px",
      display:"flex", alignItems:"center", gap:10,
    }}>
      {/* Clock */}
      <div style={{
        width:36, height:36, borderRadius:18,
        background:C.iconBg,
        display:"flex", alignItems:"center", justifyContent:"center",
        flexShrink:0,
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke={C.green} strokeWidth="1.4" />
          <path d="M8 4.5V8.5L10.5 10" stroke={C.green} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
      {/* Text */}
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.white }}>
          {from} → {to}
        </div>
        <div style={{ fontSize:12, color:C.gray2, marginTop:2 }}>
          {date} &bull; {cls}
        </div>
      </div>
      {/* Bookmark */}
      <svg width="15" height="18" viewBox="0 0 15 18" fill="none">
        <path d="M2 1h11c.55 0 1 .45 1 1v15L7.5 14 1 17V2c0-.55.45-1 1-1Z"
          stroke={C.green} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      {/* Chevron */}
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M1 1L6 6L1 11" stroke={C.gray1} strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ── Promo Card ── */
function PromoCard() {
  return (
    <div style={{
      background:C.card, border:`1px solid ${C.cardBorder}`,
      borderRadius:12, padding:"12px",
      display:"flex", alignItems:"center", gap:12,
    }}>
      {/* Train image thumbnail */}
      <div style={{
        width:76, height:76, borderRadius:10,
        background:"#0A1A0B", flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center",
        overflow:"hidden",
      }}>
        <svg width="68" height="68" viewBox="0 0 68 68">
          {/* Dark sky */}
          <rect width="68" height="68" fill="#071410" />
          {/* Tracks */}
          <line x1="34" y1="68" x2="22" y2="40" stroke="#6B5012" strokeWidth="2.5" />
          <line x1="34" y1="68" x2="46" y2="40" stroke="#6B5012" strokeWidth="2.5" />
          {/* Train body */}
          <rect x="18" y="20" width="32" height="24" rx="3" fill="#0D2212" />
          <rect x="22" y="24" width="10" height="7" rx="1.5" fill="#163020" />
          <rect x="36" y="24" width="10" height="7" rx="1.5" fill="#163020" />
          {/* Headlights */}
          <circle cx="26" cy="36" r="4"  fill="rgba(255,210,70,0.85)" />
          <circle cx="42" cy="36" r="4"  fill="rgba(255,210,70,0.85)" />
          <circle cx="26" cy="36" r="7"  fill="rgba(255,200,50,0.12)" />
          <circle cx="42" cy="36" r="7"  fill="rgba(255,200,50,0.12)" />
          {/* Green stripe */}
          <rect x="18" y="30" width="32" height="3" fill="rgba(34,197,94,0.3)" />
        </svg>
      </div>
      {/* Text */}
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.green, lineHeight:1.4, marginBottom:4 }}>
          ট্রেন খুঁজতে সহায়তা লাগছে?
        </div>
        <div style={{ fontSize:12, color:C.gray2, lineHeight:1.5 }}>
          Use our Station Guide or Route Map<br />to plan your journey better.
        </div>
      </div>
      {/* Explore button */}
      <div style={{
        border:`1.5px solid ${C.green}`,
        borderRadius:20, padding:"7px 11px",
        display:"flex", alignItems:"center", gap:5,
        flexShrink:0,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke={C.green} strokeWidth="1.3" />
          <path d="M9 4L5 5L4 9L8 8L9 4Z" fill={C.green} />
          <circle cx="6.5" cy="7.5" r="1" fill="#0D2218" />
        </svg>
        <span style={{ color:C.green, fontSize:13, fontWeight:500 }}>Explore</span>
      </div>
    </div>
  );
}

/* ── Bottom Navigation ── */
const NAV_TABS = [
  { key:"home",    label:"Home",         Icon:HomeIcon    },
  { key:"search",  label:"Search",       Icon:SearchIcon  },
  { key:"live",    label:"Live Updates", Icon:LiveIcon    },
  { key:"community", label:"Community",  Icon:CommIcon    },
  { key:"profile", label:"Profile",      Icon:ProfileIcon },
];

function BottomNav() {
  return (
    <div style={{
      height:82,
      background:C.navBg,
      borderTop:`1px solid ${C.sep}`,
      display:"flex",
      flexShrink:0,
    }}>
      {NAV_TABS.map(({ key, label, Icon }) => {
        const active = key === "search";
        return (
          <div key={key} style={{
            flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"flex-start",
            paddingTop:10, position:"relative",
          }}>
            <Icon active={active} />
            <span style={{
              fontSize:10, marginTop:4,
              color: active ? C.green : C.gray1,
              fontWeight: active ? 600 : 400,
            }}>{label}</span>
            {active && (
              <div style={{
                position:"absolute", bottom:8,
                width:22, height:3, borderRadius:2,
                background:C.green,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function HomeIcon({ active }) {
  const c = active ? C.green : C.gray1;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5Z"
        stroke={c} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function SearchIcon({ active }) {
  const c = active ? C.green : C.gray1;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={c} strokeWidth="2" />
      <path d="M15.5 15.5L20 20" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function LiveIcon({ active }) {
  const c = active ? C.green : C.gray1;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2.5" stroke={c} strokeWidth="1.5" />
      <path d="M7.5 12c0-2.485 2.015-4.5 4.5-4.5S16.5 9.515 16.5 12"
        stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M4.5 12C4.5 7.305 7.805 3.5 12 3.5S19.5 7.305 19.5 12"
        stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function CommIcon({ active }) {
  const c = active ? C.green : C.gray1;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="9"  cy="8" r="3.5" stroke={c} strokeWidth="1.5" />
      <circle cx="17" cy="8" r="3"   stroke={c} strokeWidth="1.5" />
      <path d="M3 20c0-2.761 2.686-5 6-5s6 2.239 6 5"
        stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M17 15c2.5 0 4 1.5 4 3.5"
        stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function ProfileIcon({ active }) {
  const c = active ? C.green : C.gray1;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4"   stroke={c} strokeWidth="1.5" />
      <path d="M5 20c0-2.761 3.134-5 7-5s7 2.239 7 5"
        stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
