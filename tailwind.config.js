/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#0D1117',
        'brand-secondary': '#161B22',
        'brand-accent': '#30363D',
        'brand-gold': '#D4AF37',
        'brand-text': '#E6EDF3',
        'brand-light': '#8B949E',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}