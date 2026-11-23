/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#CE1126',
          'red-deep': '#A50D1E',
          charcoal: '#0F1B2D',
        },
        // Kaca palette: ink on mist, flag red, white glass.
        ink: 'rgb(var(--ink) / <alpha-value>)',
        mist: 'rgb(var(--mist) / <alpha-value>)',
        merah: 'rgb(var(--merah) / <alpha-value>)',
        emas: 'rgb(var(--emas) / <alpha-value>)',
        teal: 'rgb(var(--teal) / <alpha-value>)',
        navy: 'rgb(var(--navy) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          dark: '#0A1220',
          card: '#111C2E',
        },
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        land: 'rgb(var(--land) / <alpha-value>)',
        'land-on': 'rgb(var(--land-on) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Classic Times-family serif for headlines (Times New Roman where installed, Tinos webfont elsewhere)
        display: ['"Times New Roman"', 'Tinos', 'Times', 'serif'],
        ui: ['"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'sans-serif'],
      },
      maxWidth: {
        content: '1240px',
        prose: '68ch',
      },
      borderRadius: {
        // radius by role: control 14, card 28, sheet 36
        control: '14px',
        card: '28px',
        sheet: '36px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,27,45,0.06), 0 8px 24px -12px rgba(15,27,45,0.18)',
        'soft-lg': '0 2px 4px rgba(15,27,45,0.05), 0 24px 60px -24px rgba(15,27,45,0.35)',
        lift: '0 30px 80px -30px rgba(15,27,45,0.45)',
        glass: 'inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(255,255,255,0.15), 0 20px 50px -24px rgba(15,27,45,0.35)',
      },
      keyframes: {
        sheen: {
          '0%': { transform: 'translateX(-120%) skewX(-20deg)' },
          '100%': { transform: 'translateX(220%) skewX(-20deg)' },
        },
        pageIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        sheen: 'sheen 1.2s cubic-bezier(0.22,1,0.36,1) 1',
        'page-in': 'pageIn 350ms cubic-bezier(0.22,1,0.36,1) forwards',
      },
    },
  },
  plugins: [],
};
