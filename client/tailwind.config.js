/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        byui: {
          navy: '#003865',
          navyDark: '#002244',
          gold: '#E1A829',
          goldDark: '#C48F1A',
          gray: '#F4F4F4',
          border: '#D1D5DB',
        },
      },
    },
  },
  plugins: [],
};
