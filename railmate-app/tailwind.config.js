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
        // Dark theme (default — app is always dark)
        'bg-base':         '#080D17',
        'bg-elevated':     '#0F1929',
        'bg-card':         '#162035',
        'bg-overlay':      '#1A2840',

        'primary':         '#00A859',
        'primary-dim':     '#007A40',
        'primary-subtle':  'rgba(0,168,89,0.1)',

        'accent':          '#F5A623',
        'accent-dim':      '#C4830A',
        'accent-subtle':   'rgba(245,166,35,0.1)',

        'danger':          '#E8394B',
        'danger-subtle':   'rgba(232,57,75,0.1)',
        'success':         '#00C977',
        'success-subtle':  'rgba(0,201,119,0.1)',
        'info':            '#4EA8E0',
        'info-subtle':     'rgba(78,168,224,0.1)',

        'text-primary':    '#F0F4FF',
        'text-secondary':  '#8FA3C0',
        'text-tertiary':   '#4E6480',
        'text-inverse':    '#080D17',

        'border':          '#1E2E42',
        'border-strong':   '#2A3F57',
        'border-focus':    '#00A859',
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
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '20px',
        'xl': '24px',
      },
    },
  },
  plugins: [],
};
