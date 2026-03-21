/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:       "#F8F7F4",
        surface:  "#EEEAE3",
        primary:  "#5B8DEF",
        success:  "#7EC8A4",
        warning:  "#F0A500",
        textMain: "#2D2D2D",
        textSub:  "#6B6B6B",
      },
      fontFamily: {
        sans:    ["Inter", "Atkinson Hyperlegible", "sans-serif"],
        dyslexic: ["OpenDyslexic", "sans-serif"],
      },
      lineHeight: {
        relaxed: "1.8",
      },
      maxWidth: {
        reading: "65ch",
      },
    },
  },
  plugins: [],
}

