/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F7931A',
        secondary: '#2E86AB',
        accent: '#F77F00',
        dark: '#1E1E1E',
        light: '#F8F9FA',
      },
    },
  },
  plugins: [],
}
