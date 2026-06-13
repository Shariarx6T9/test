import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base':        'var(--bg-base)',
        'bg-elevated':    'var(--bg-elevated)',
        'bg-card':        'var(--bg-card)',
        'bg-overlay':     'var(--bg-overlay)',
        'primary':        'var(--primary)',
        'primary-dim':    'var(--primary-dim)',
        'accent':         '#F5A623',
        'accent-dim':     '#C4830A',
        'border':         'var(--border)',
        'border-subtle':  'var(--border-subtle)',
        'border-strong':  'var(--border-strong)',
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary':  'var(--text-tertiary)',
        'text-inverse':   'var(--text-inverse)',
        'danger':         '#E8394B',
        'success':        '#00C977',
        'info':           '#4EA8E0',
      },
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        inter:   ['var(--font-inter)',   'system-ui', 'sans-serif'],
        bengali: ['var(--font-bengali)', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm:   '6px',
        md:   '10px',
        lg:   '16px',
        xl:   '24px',
        full: '9999px',
      },
      animation: {
        float:       'float 3s ease-in-out infinite',
        'fade-in-up':'fadeInUp 0.5s ease-out forwards',
        'fade-in':   'fadeIn 0.6s ease-out forwards',
        shimmer:     'shimmer 1.5s linear infinite',
        'slide-in':  'slideIn 0.4s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
