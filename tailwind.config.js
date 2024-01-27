module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        text: "#1F1F41",
        accent: "#fff",
        "accent-light": "#fff",
      },
    },

    fontFamily: {
      base: ["Gilroy"],
    },
  },
  plugins: [],
};
