/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#fff7ed', 
          DEFAULT: '#ea580c', // Appealing Orange
          dark: '#9a3412', 
        },
        accent: {
          DEFAULT: '#111827', // Slate Dark Gray
        }
      }
    },
  },
  plugins: [],
}
