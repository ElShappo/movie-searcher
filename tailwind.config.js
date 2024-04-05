/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kinopoisk: "#cfca00",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
