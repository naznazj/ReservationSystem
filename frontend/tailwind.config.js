/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        pri: '#8AC926',       // Primary Color
        sec: '#14213D',       // Secondary Color
        base: '#FFFFFF',      // Base Color
        neut: '#E5E5E5',      // Neutral Color
      },
      boxShadow: {
        custom: '0 2px 2px rgba(0, 0, 0, 0.25)',  // Custom shadow
      },
    },
  },
  plugins: [],
}

