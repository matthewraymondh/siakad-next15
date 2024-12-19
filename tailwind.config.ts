/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "congress-blue": {
          "50": "#edf9ff",
          "100": "#d6f1ff",
          "200": "#b6e8ff",
          "300": "#83dbff",
          "400": "#49c5ff",
          "500": "#1fa5ff",
          "600": "#0787ff",
          "700": "#016ff4",
          "800": "#0857c5",
          "900": "#0d4891",
          "950": "#0e2f5d",
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
