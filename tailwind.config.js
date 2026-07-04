/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        readex: ['"Readex Pro"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
