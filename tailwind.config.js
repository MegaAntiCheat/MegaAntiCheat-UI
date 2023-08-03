/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#282c34',
        secondary: '#eaebf3',
        sidebar: '#191919',
      },
    },
  },
  plugins: [],
};
