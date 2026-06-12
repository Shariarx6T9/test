/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ── DARK MODE BACKGROUNDS ─────────────────────────────────────────
        'bg-base':          '#080D17',
        'bg-elevated':      '#0F1929',
        'bg-card':          '#162035',
        'bg-overlay':       '#1A2840',

        // ── BRAND / PRIMARY ───────────────────────────────────────────────
        'primary':          '#00A859',
        'primary-dim':      '#007A40',
        'primary-subtle':   '#00A85918',  // ← WAS MISSING — used by Chip, TrainCard, etc.

        // ── ACCENT ────────────────────────────────────────────────────────
        'accent':           '#F5A623',
        'accent-dim':       '#C4830A',
        'accent-subtle':    '#F5A62318',  // ← WAS MISSING — used by profile palette icon

        // ── SEMANTIC ──────────────────────────────────────────────────────
        'danger':           '#E8394B',
        'danger-subtle':    '#E8394B1A',  // ← WAS MISSING — used by station dot, trash btn
        'success':          '#00C977',
        'success-subtle':   '#00C9771A',  // ← WAS MISSING — used by Badge
        'info':             '#4EA8E0',
        'info-subtle':      '#4EA8E018',  // ← WAS MISSING — used by language icon bg

        // ── TEXT ──────────────────────────────────────────────────────────
        'text-primary':     '#F0F4FF',
        'text-secondary':   '#8FA3C0',
        'text-tertiary':    '#4E6480',
        'text-inverse':     '#080D17',

        // ── BORDERS ───────────────────────────────────────────────────────
        'border':           '#1E2E42',
        'border-strong':    '#2A3F57',    // ← WAS MISSING — used by SavedRoutes empty state
        'border-focus':     '#00A859',    // ← WAS MISSING — used by Input focus ring
      },
      fontFamily: {
        'jakarta':          ['PlusJakartaSans_700Bold'],
        'jakarta-bold':     ['PlusJakartaSans_800ExtraBold'],
        'inter':            ['Inter_400Regular'],
        'inter-medium':     ['Inter_500Medium'],
        'inter-semibold':   ['Inter_600SemiBold'],
        'bengali':          ['NotoSansBengali_400Regular'],
        'bengali-semibold': ['NotoSansBengali_600SemiBold'],
        'mono':             ['JetBrainsMono_400Regular'],
        'mono-medium':      ['JetBrainsMono_500Medium'],
      },
      borderRadius: {
        'xs': 8,
        'sm': 12,
        'md': 16,
        'lg': 20,
        'xl': 24,
      },
    },
  },
  plugins: [],
};
