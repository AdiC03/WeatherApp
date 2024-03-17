/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    // Custom colors
    extend: {
      colors: {
        "weather-primary": "#00668A",
        "weather-secondary": "#004E71",
      },
    },
    // fonts
    fontFamily: {
      Roboto: ["Roboto, sans-serif"],
    },
    // Margins/Padding
    container: {
      padding: "2rem",
      center: true,
    },
    // breakpoints
    screens: {
      sm: "640px",
      md: "768px",
    },
  },
  plugins: [],
}

