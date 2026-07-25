/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        bond: {
          bg: '#000000',
          panel: '#111111',
          surface: '#171717',
          text: '#fafafa',
          muted: '#a3a3a3',
          faint: '#737373',
          border: 'rgba(255,255,255,0.08)',
          accent: '#a3a3a3',
          'accent-hover': '#d4d4d4',
          success: '#8f9a88',
        },
        stripe: {
          purple: '#a3a3a3',
          'purple-hover': '#d4d4d4',
          'purple-deep': '#404040',
          'purple-light': '#e5e5e5',
          navy: '#fafafa',
          label: '#d4d4d4',
          body: '#a3a3a3',
          border: 'rgba(255,255,255,0.08)',
          'border-purple': 'rgba(163,163,163,0.35)',
          'brand-dark': '#000000',
          ruby: '#a3a3a3',
          magenta: '#a3a3a3',
          'magenta-light': '#d4d4d4',
          success: '#8f9a88',
          'success-text': '#8f9a88',
          bg: '#000000',
          surface: 'rgba(255,255,255,0.045)',
        },
      },
      boxShadow: {
        'stripe-sm': '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.18)',
        'stripe-md': '0 24px 70px rgba(0,0,0,0.24)',
        'stripe-lg': '0 30px 90px rgba(0,0,0,0.30)',
        'stripe-xl': '0 40px 120px rgba(0,0,0,0.40)',
      },
      letterSpacing: {
        'tight-hero': '-0.075em',
        'tight-lg': '-0.055em',
        'tight-md': '-0.035em',
        'tight-sm': '-0.015em',
      },
    },
  },
  plugins: [],
}
