/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      width: {
        vw: 'calc(100vw - (100vw - 100%))',
      },
    },
  },
  plugins: [],
}
