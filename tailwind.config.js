/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'flex-row',
    'flex-col',
    'cursor-row-resize',
    'cursor-col-resize',
    'h-[90%]'
  ],
  theme: {
    extend: {
    },
  },
  plugins: [],
}
