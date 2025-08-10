/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'candle': ['Metropolis', 'sans-serif'],
        'logo': ['Rolling Beat', 'cursive'],
        'fancy': ['Rolling Beat', 'cursive'],
        'modern': ['Metropolis', 'sans-serif'],
        'display': ['Metropolis', 'sans-serif'],
        'header': ['Rolling Beat', 'cursive'],
        'ai': ['Wasted-Vindey', 'cursive'], // New font for AI section
      },
      colors: {
        'candle-orange': '#FF6B35',
        'candle-orange-light': '#FF8C42',
        'candle-orange-lighter': '#FFA366',
        'candle-orange-dark': '#E55A2B',
        'candle-orange-darker': '#CC4A1F',
        'candle-dark': '#2C1810',
        'candle-light': '#FFE4D6',
        'candle-warm': '#FFB366',
        'candle-peach': '#FFCC99',
        'candle-accent': '#FF8C42',
        'candle-cream': '#FFF2E6',
        'candle-bronze': '#D2691E',
        'candle-copper': '#CD853F',
        'candle-amber': '#FFA500',
        'candle-gold': '#FFD700',
      },
      backgroundImage: {
        'candle-gradient': 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 25%, #FFA366 50%, #FFB366 75%, #FFE4D6 100%)',
        'candle-gradient-dark': 'linear-gradient(135deg, #2C1810 0%, #4A2C1A 25%, #6B3D2A 50%, #8B4E3A 75%, #A55F4A 100%)',
        'orange-sunset': 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 20%, #FFA366 40%, #FFB366 60%, #FFCC99 80%, #FFE4D6 100%)',
        'dark-elegant': 'linear-gradient(135deg, #1A1A1A 0%, #2C1810 25%, #4A2C1A 50%, #6B3D2A 75%, #8B4E3A 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'candle-glow': '0 0 20px rgba(255, 107, 53, 0.3)',
        'candle-glow-dark': '0 0 20px rgba(255, 107, 53, 0.2)',
        'orange-glow': '0 0 30px rgba(255, 140, 0, 0.4)',
        'dark-elegant': '0 10px 30px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'candle-flicker': 'flicker 2s infinite alternate',
        'logo-float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'glow-pulse': {
          '0%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 107, 53, 0.6)' },
        },
      },
    },
  },
  plugins: [],
} 