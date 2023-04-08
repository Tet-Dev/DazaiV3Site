/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{html,jsx,tsx}","./components/**/**/*.{html,jsx,tsx}","./components/**/**/**/*.{html,jsx,tsx}", "pages/**/*.{html,jsx,tsx}"],
  theme: {
    extend: {
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.555, -0.005, 0.000, 1.650)',
      },
      animation: {
        'reverse-spin': 'reverse-spin 1s linear infinite',
        shake: 'shake 1s cubic-bezier(.36,.07,.19,.97) infinite',
        gradient: 'gradient 1s linear infinite',
        'gradient-medium': 'gradient 2s linear infinite',
        'gradient-slow': 'gradient 3s linear infinite',
        'gradienttoplefttobottomright': 'gradienttoplefttobottomright 1s linear infinite',
        'bounce-mini': 'bounce-mini 8s ease-in-out infinite',
        'bounce-mini2': 'bounce-mini2 3s ease-in-out infinite',
      },
      keyframes: {
        'reverse-spin': {
          from: {
            transform: 'rotate(360deg)',
          },
        },
        'bounce-mini': {
          '0%, 100%': {
            transform: 'translateY(0px)',
            // 'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(15px)',
            // 'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'bounce-mini2': {
          '0%, 100%': {
            transform: 'translateY(0px)',
            // 'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(5px)',
            // 'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        shake: {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)',
          },
          '20%, 80%': {
            transform: 'translate3d(2px, 0, 0)',
          },
          '30%, 50%, 70%': {
            transform: 'translate3d(-4px, 0, 0)',
          },
          '40%, 60%': {
            transform: 'translate3d(4px, 0, 0)',
          },
        },
        gradient: {
          from: {
            'background-size': '200%',
          },
          to: {
            'background-position': '200% center',
            'background-size': '200%',
          },
        },
        gradienttoplefttobottomright: {
          "0%": {
            "background-position": "0% 0%",
            "background-size": "200% 200%",
          },
          "50%": {
            "background-position": "100% 100%",
            "background-size": "200% 200%",
          },
          "100%": {
            "background-position": "0% 0%",
            "background-size": "200% 200%",
          },
        },
      },
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
  
  plugins: [require('@tailwindcss/typography'),
],
};
