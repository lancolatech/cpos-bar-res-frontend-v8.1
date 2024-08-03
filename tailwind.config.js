/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        'lexend': ['Lexend', 'sans-serif'],
      },
      colors: {
        red: "#ff3333",
        dark: "#111315",
        gray: "#676676",
        darkGray: "#292C2D",
        jadedust: "#CFDDDB",
        lavender: "#E4CDED",
        powderBlue: "#C2DBE9",
        palePink: "#F1C8D0",
        white: "#FFFFFF",
        periwinklebBlue: "#C9CAEF",
        btnbg: "#6E6D7A",
      },
    },
  },
  plugins: [],
};
