"use strict";

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#1F1F41",
        accent: "#F75605",
        "accent-light": "#F75605"
      }
    },
    fontFamily: {
      base: ["Gilroy"]
    }
  },
  plugins: []
};