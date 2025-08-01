/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'candle-orange': '#FF6B35',
        'candle-dark': '#2C1810',
        'candle-light': '#FFE4D6',
        'candle-accent': '#FF8C42',
      },
      fontFamily: {
        'candle': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 