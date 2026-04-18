/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#CE1126',
          charcoal: '#1A1A1A',
        },
        surface: {
          dark: '#0F0F0F',
          card: '#1C1C1C',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
        500: '500ms',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'flag-wave': {
          '0%, 100%': { transform: 'scale(1.02) rotate(-0.5deg)' },
          '50%': { transform: 'scale(1.05) rotate(0.5deg)' },
        },
        'hero-shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        heroWord: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        heroSub: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        milestoneIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pageIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'flag-wave': 'flag-wave 8s ease-in-out infinite',
        'hero-shimmer': 'hero-shimmer 12s ease infinite',
        'hero-word': 'heroWord 0.55s ease-out forwards',
        'hero-sub': 'heroSub 0.6s ease-out forwards',
        'milestone-in': 'milestoneIn 0.45s ease-out forwards',
        'page-in': 'pageIn 200ms ease-out forwards',
      },
    },
  },
  plugins: [],
};
