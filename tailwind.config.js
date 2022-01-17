module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      primary: '#ff4b2b',
      secondary: '#ff416c',
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
