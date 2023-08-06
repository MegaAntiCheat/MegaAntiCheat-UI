/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#282c34',
        secondary: '#191f27',
        highlight: '#eaebf3',
        outline: '#c5c6d1',
      },
      gridTemplateColumns: {
        player:
          '120px minmax(100px, 1fr) 18px minmax(0px, 100px) minmax(0px, 60px)',
        playersm: '120px minmax(100px, 1fr) 18px',
        scoreboardnav: '130px minmax(95px, 1fr) 90px 55px',
        scoreboardnavsm: '180px 130px',
        scoreboardgrid: '1fr 3px 1fr',
        scoreboardgridsm: '1fr',
      },
      fontFamily: {
        build: ['"Build"', 'sans-serif'],
      },
    },
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
