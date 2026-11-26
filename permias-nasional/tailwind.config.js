/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  // hover styles only on devices that really hover, so a tap never leaves a control stuck in its hover state
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        // Neutral base (ink on white, a few greys) plus ONE accent. The accent is chosen by data-accent on <html> (index.html).
        ink: 'rgb(var(--ink) / <alpha-value>)',
        mist: 'rgb(var(--mist) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'on-accent': 'rgb(var(--on-accent) / <alpha-value>)',
        // constant near-black for photo backdrops and the footer (same in light and dark)
        night: 'rgb(var(--night) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
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
        // the one shadow style: floating panels, menus, popovers
        soft: '0 1px 2px rgb(0 0 0 / 0.04), 0 16px 40px -20px rgb(0 0 0 / 0.22)',
      },
    },
  },
  plugins: [],
};
