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
          panel: '#20201f',
          surface: '#2a2926',
          text: '#f7f8f8',
          muted: '#b9b2a5',
          faint: '#7d766a',
          border: 'rgba(255,255,255,0.08)',
          accent: '#d8b15f',
          'accent-hover': '#e4c579',
          success: '#b7c8a3',
        },
        stripe: {
          purple: '#d8b15f',
          'purple-hover': '#e4c579',
          'purple-deep': '#6f5628',
          'purple-light': '#f2dca2',
          navy: '#f7f8f8',
          label: '#d0d6e0',
          body: '#8a8f98',
          border: 'rgba(255,255,255,0.08)',
          'border-purple': 'rgba(216,177,95,0.35)',
          'brand-dark': '#08090a',
          ruby: '#f43f5e',
          magenta: '#a78bfa',
          'magenta-light': '#c4b5fd',
          success: '#b7c8a3',
          'success-text': '#b7c8a3',
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
