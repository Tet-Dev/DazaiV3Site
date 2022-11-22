/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["components/**/*.{html,jsx,tsx}", "app/**/*.{html,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: require("tailwindcss/colors").zinc,
      },
      fontFamily: {
        wsans: ["Work Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      }
    },
  },
  plugins: [],
};
