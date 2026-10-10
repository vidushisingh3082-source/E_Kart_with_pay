/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1C1A17",
          foreground: "#FAF7F2",
        },
        ivory: "#FAF7F2",
        ink: "#1C1A17",
        wine: {
          DEFAULT: "#7A2E38",
          light: "#9C4650",
        },
        sand: "#D8CBB4",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
