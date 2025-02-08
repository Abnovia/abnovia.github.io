/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.pug'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bloggaren: {
          bg: '#1a1a1a', // Dark background
          text: '#ffffff', // White text
          accent: '#3182ce', // Blue accent color
          secondary: '#2d2d2d', // Slightly lighter background for cards
        },
      },
    },
  },
  plugins: [],
};
