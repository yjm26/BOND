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
          bg: '#08090a',
          panel: '#0f1011',
          surface: '#191a1b',
          text: '#f7f8f8',
          muted: '#a0a7b4',
          faint: '#62666d',
          border: 'rgba(255,255,255,0.08)',
          accent: '#5e6ad2',
          'accent-hover': '#7170ff',
          success: '#10b981',
        },
        stripe: {
          purple: '#5e6ad2',
          'purple-hover': '#7170ff',
          'purple-deep': '#2f356f',
          'purple-light': '#828fff',
          navy: '#f7f8f8',
          label: '#d0d6e0',
          body: '#8a8f98',
          border: 'rgba(255,255,255,0.08)',
          'border-purple': 'rgba(124,140,255,0.35)',
          'brand-dark': '#08090a',
          ruby: '#f43f5e',
          magenta: '#a78bfa',
          'magenta-light': '#c4b5fd',
          success: '#10b981',
          'success-text': '#34d399',
          bg: '#08090a',
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
