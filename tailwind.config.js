/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* The 4 Core Festival Colors */
        'misty-aqua':     '#DDF3F0',
        'caribbean-teal': '#20B2AA',
        'peacock-blue':   '#006D8F',
        'deep-teal':      '#064E52',

        festival: {
          /* ── Misty Aqua / Light surfaces ── */
          surface:  '#DDF3F0',          // primary light background
          aqua:     '#DDF3F0',
          card:     'rgba(255, 255, 255, 0.94)', // crisp clean light card
          cardtint: 'rgba(221, 243, 240, 0.85)',
          
          /* ── Deep Teal for structure / contrast / headings ── */
          dark:     '#064E52',          // Deep Teal text & structure
          navy:     '#043B3E',          // Deep Teal dark variant
          cream:    '#064E52',          // Main text / headings on light
          deepteal: '#064E52',

          /* ── Caribbean Teal interactive accent ── */
          emerald:  '#20B2AA',          // Caribbean Teal primary button/accent
          'emerald-light': '#38C7BF',   // bright hover Caribbean Teal
          'emerald-deep':  '#006D8F',   // Peacock Blue
          teal:     '#20B2AA',
          caribbean:'#20B2AA',

          /* ── Peacock Blue secondary accent ── */
          peacock:  '#006D8F',
          champagne:'#006D8F',         // secondary accent
          gold:     '#006D8F',         // Peacock Blue
          'gold-light': '#20B2AA',     // Caribbean Teal
          'gold-dark':  '#064E52',     // Deep Teal

          /* ── Utility ── */
          border:   'rgba(0, 109, 143, 0.18)', // subtle Peacock Blue border
          muted:    '#4A6B6D',                 // readable muted teal-slate
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 15px rgba(32,178,170,0.30)' },
          '100%': { boxShadow: '0 0 35px rgba(0,109,143,0.40)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 20%, rgba(32,178,170,0.18) 0%, rgba(0,109,143,0.10) 40%, transparent 70%)',
        'teal-shimmer': 'linear-gradient(90deg, #006D8F 0%, #20B2AA 30%, #DDF3F0 50%, #20B2AA 70%, #006D8F 100%)',
      }
    },
  },
  plugins: [],
}
