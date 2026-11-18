/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4EFE6", // נייר חם
        "paper-2": "#E9E2D3", // נייר כהה יותר, למשטחים
        ink: "#111111", // דיו
        accent: "#FF4A1C", // אדום-כתום, הצבע היחיד
      },
      fontFamily: {
        serif: ['"Frank Ruhl Libre"', "Georgia", "serif"],
        sans: ["Heebo", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [],
};
