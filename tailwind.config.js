/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{html,jsx,tsx}","./components/**/**/*.{html,jsx,tsx}","./components/**/**/**/*.{html,jsx,tsx}", "pages/**/*.{html,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          ...require("tailwindcss/colors").zinc,
          1000: '#120102',
          850: '#202023',
          750: '#333338',
          650: '#4d4d4f',
          350: '#bbbbc1',
          250: '#dcdce0',
          150: '#ececee',
        },
      },
      fontFamily: {
        wsans: ["Work Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      }
    },
    screens: {
      inf: { max: '99999999px' },
      //  => @media (max-width: 99999999px) { ... } Literally so i can use a form of !important
  
      '4xl': { max: '4096px' },
      // => @media (max-width: 4096px) { ... } Wtf is this...
      '3.5xl': { max: '3096px' },
  
      '3xl': { max: '2048px' },
      // => @media (max-width: 2048px) { ... }
  
      '2.5xl': { max: '1920px' },
      // => @media (max-width: 1920px) { ... }
  
      '2xl': { max: '1535px' },
      // => @media (max-width: 1535px) { ... }
  
      xl: { max: '1279px' },
      // => @media (max-width: 1279px) { ... }
  
      lg: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }
  
      md: { max: '767px' },
      // => @media (max-width: 767px) { ... }
  
      sm: { max: '639px' },
      // => @media (max-width: 639px) { ... }
      xs: { max: '389px' },
      // => @media (max-width: 389px) { ... }
    },
  },
  
  plugins: [],
};
