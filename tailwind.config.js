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
        /* Primary Dragon Fruit */
        'dragon-fruit': '#FF1493',
        'dragon-fruit-bright': '#FF2B9A',
        'dragon-fruit-deep': '#C4006F',

        /* Secondary Night Violet */
        'night-violet': '#5B21F5',
        'electric-purple': '#7C3AED',
        'deep-violet': '#24104F',

        /* Backgrounds */
        'near-black': '#05030D',
        'violet-black': '#080514',
        'purple-black': '#10051D',

        /* Accents */
        'soft-lavender': '#D8B4FE',
        'neon-white': '#F5F0FF',
        'blue-violet': '#8B7CFF',

        /* Festival Theme Overrides */
        festival: {
          surface: '#05030D',
          card: 'rgba(16, 5, 29, 0.65)',
          cardtint: 'rgba(20, 8, 40, 0.75)',
          dark: '#05030D',
          navy: '#080514',
          cream: '#F5F0FF',
          deepteal: '#080514',
          emerald: '#FF1493',
          'emerald-light': '#FF2B9A',
          'emerald-deep': '#C4006F',
          teal: '#FF1493',
          caribbean: '#FF1493',
          peacock: '#7C3AED',
          champagne: '#5B21F5',
          gold: '#D8B4FE',
          'gold-light': '#FF2B9A',
          'gold-dark': '#7C3AED',
          border: 'rgba(216, 180, 254, 0.18)',
          muted: '#B9A9D6',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pink': 'glowPink 3s ease-in-out infinite alternate',
        'glow-violet': 'glowViolet 3s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPink: {
          '0%':   { boxShadow: '0 0 15px rgba(255, 20, 147, 0.35)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 20, 147, 0.65)' },
        },
        glowViolet: {
          '0%':   { boxShadow: '0 0 15px rgba(91, 33, 245, 0.35)' },
          '100%': { boxShadow: '0 0 40px rgba(91, 33, 245, 0.65)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 20%, rgba(255,20,147,0.2) 0%, rgba(91,33,245,0.18) 40%, transparent 70%)',
      }
    },
  },
  plugins: [],
}
