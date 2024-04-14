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
        player: '122px minmax(100px, 1fr) max-content minmax(0px, 60px)',
        history: '122px minmax(100px, 1fr) max-content minmax(0px, 110px)',
        playersm: '120px minmax(100px, 1fr) 18px',
        historysm: '120px minmax(100px, 1fr) 18px',
        scoreboardnav: '114px minmax(95px, 1fr) 55px',
        scoreboardnavhistory: '114px minmax(95px, 1fr) 110px',
        scoreboardnavsm: '180px 130px',
        scoreboardnavhistorysm: '180px 130px',
        scoreboardgrid: '1fr 3px 1fr',
        scoreboardgridsm: '1fr',
        playerdetails: '150px auto',
        playerdetailscontent: '160px 3px auto',
      },
      gridTemplateRows: {
        playerhistorycard: '40px 22px 40px auto',
      },
      fontFamily: {
        build: ['"Build"', 'sans-serif'],
      },
      minWidth: {
        pageselectorbutton: '40px',
      },
    },
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
