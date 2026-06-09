/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        byui: {
          blue: '#006ca5',
          blueDark: '#005a8e',
          blueLight: '#0072b0',
          green: '#50b95b',
          greenDark: '#3da348',
          purple: '#8f00f8',
          enrolled: '#008fdd',
          gray: '#f4f4f4',
          cardGray: '#e8e8e8',
          border: '#D1D2D2',
          text: '#515252',
          textLight: '#6f6f70',
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
