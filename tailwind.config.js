/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F39F9F",       // Light pink (accent)
        "primary-dark": "#c471ed", // Gradient pink tone
        "sky-light": "#56CCF2",    // Sky blue for gradients
        accent: "#2d6a4f",         // Deep green (buttons)
        text: "#1f2937",           // Neutral gray text
        surface: "#ffffff",        //Card background(light)
        darkBg1: "#050507",        // 3D dark base
        darkBg2: "#0b0b10",        // Gradient middle
        darkBg3: "#141418",        // Shadow layer
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        smooth: "0 4px 14px rgba(0, 0, 0, 0.1)",
        "3d-dark": "0 0 20px rgba(255, 255, 255, 0.05)",
        "neon-sky": "0 0 10px rgba(86, 204, 242, 0.7)",
        "neon-pink": "0 0 10px rgba(243, 159, 159, 0.7)",
      },
      backgroundImage: {
        "gradient-sky-pink": "linear-gradient(90deg, #56CCF2, #F39F9F)",
        "gradient-dark": "linear-gradient(135deg, #050507, #0b0b10, #141418)",
      },
    },
  },
  plugins: [],
};