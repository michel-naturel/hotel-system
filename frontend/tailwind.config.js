/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FEFAF0",
        primary: "#E7B290",
        secondary: "#F2D3C8",
        text: "#3D3C3A",
        muted: "#8E8379",
      },
    },
  },
  plugins: [],
};