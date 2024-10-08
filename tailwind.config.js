/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      'blue-dark': '#1C2A6D',
      'blue-dark-hover': '#17235C',
      gray: '#D9D9D9',
      'gray-light': '#EFEFEF',
      'gray-dark': '#9B9B9B',
      white: '#FFFFFF',
      'purple-dark': '#939FDB',
      'purple-light': '#D0D3EA',
    },
    fontFamily: {
      main: ['Inter', 'sans-serif'],
    },
  },
  plugins: [],
};
