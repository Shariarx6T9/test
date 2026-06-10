import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#080D17',
        'bg-elevated': '#0F1929',
        'bg-card': '#162035',
        'bg-overlay': '#1A2840',
        'primary': '#00A859',
        'primary-dim': '#007A40',
        'primary-subtle': 'rgba(0,168,89,0.10)',
        'accent': '#F5A623',
        'accent-dim': '#C4830A',
        'danger': '#E8394B',
        'success': '#00C977',
        'info': '#4EA8E0',
        'text-primary': '#F0F4FF',
        'text-secondary': '#8FA3C0',
        'text-tertiary': '#4E6480',
        'text-inverse': '#080D17',
        'border': '#1E2E42',
        'border-strong': '#2A3F57',
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        bengali: ['var(--font-bengali)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
        'full': '9999px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'shimmer': 'shimmer 1.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
