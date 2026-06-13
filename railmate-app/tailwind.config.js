/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-base':          'var(--color-bg-base)',
        'bg-elevated':      'var(--color-bg-elevated)',
        'bg-card':          'var(--color-bg-card)',
        'bg-overlay':       'var(--color-bg-overlay)',

        'primary':          'var(--color-primary)',
        'primary-dim':      'var(--color-primary-dim)',
        'primary-subtle':   'var(--color-primary-subtle)',

        'accent':           'var(--color-accent)',
        'accent-dim':       'var(--color-accent-dim)',
        'accent-subtle':    'var(--color-accent-subtle)',

        'danger':           'var(--color-danger)',
        'danger-subtle':    'var(--color-danger-subtle)',
        'success':          'var(--color-success)',
        'success-subtle':   'var(--color-success-subtle)',
        'info':             'var(--color-info)',
        'info-subtle':      'var(--color-info-subtle)',

        'text-primary':     'var(--color-text-primary)',
        'text-secondary':   'var(--color-text-secondary)',
        'text-tertiary':    'var(--color-text-tertiary)',
        'text-inverse':     'var(--color-text-inverse)',

        'border':           'var(--color-border)',
        'border-strong':    'var(--color-border-strong)',
        'border-focus':     'var(--color-border-focus)',
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
