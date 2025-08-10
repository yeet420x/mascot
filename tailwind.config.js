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
        'candle-orange': '#D84315', // Darker orange
        'candle-orange-light': '#E64A19', // Slightly lighter dark orange
        'candle-orange-lighter': '#F4511E', // Medium dark orange
        'candle-orange-dark': '#BF360C', // Very dark orange
        'candle-orange-darker': '#8D2F0A', // Darkest orange
        'candle-dark': '#1A1A1A', // Pure black
        'candle-light': '#FFFFFF', // Pure white
        'candle-warm': '#D84315', // Dark orange
        'candle-peach': '#E64A19', // Dark orange variant
        'candle-accent': '#D84315', // Dark orange accent
        'candle-cream': '#FFFFFF', // White
        'candle-bronze': '#BF360C', // Dark orange bronze
        'candle-copper': '#D84315', // Dark orange copper
        'candle-amber': '#D84315', // Dark orange amber
        'candle-gold': '#E64A19', // Dark orange gold
      },
      backgroundImage: {
        'candle-gradient': 'linear-gradient(135deg, #D84315 0%, #E64A19 25%, #F4511E 50%, #D84315 75%, #FFFFFF 100%)',
        'candle-gradient-dark': 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 25%, #D84315 50%, #E64A19 75%, #F4511E 100%)',
        'orange-sunset': 'linear-gradient(135deg, #D84315 0%, #E64A19 20%, #F4511E 40%, #D84315 60%, #E64A19 80%, #FFFFFF 100%)',
        'dark-elegant': 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 25%, #D84315 50%, #E64A19 75%, #F4511E 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'candle-glow': '0 0 20px rgba(216, 67, 21, 0.3)',
        'candle-glow-dark': '0 0 20px rgba(216, 67, 21, 0.2)',
        'orange-glow': '0 0 30px rgba(216, 67, 21, 0.4)',
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
          '0%': { boxShadow: '0 0 20px rgba(216, 67, 21, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(216, 67, 21, 0.6)' },
        },
      },
    },
  },
  plugins: [],
} 