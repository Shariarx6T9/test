/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
    './stores/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'bg-base':        '#080D17',
        'bg-elevated':    '#0F1929',
        'bg-card':        '#162035',
        'bg-overlay':     '#1A2840',
        'primary':        '#00A859',
        'primary-dim':    '#007A40',
        'accent':         '#F5A623',
        'danger':         '#E8394B',
        'success':        '#00C977',
        'info':           '#4EA8E0',
        'text-primary':   '#F0F4FF',
        'text-secondary': '#8FA3C0',
        'text-tertiary':  '#4E6480',
        'text-inverse':   '#080D17',
        'border':         '#1E2E42',
        'border-strong':  '#2A3F57',
      },
    },
  },
  plugins: [],
};
