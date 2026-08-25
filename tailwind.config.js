/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F7A4C',
          dark: '#18633E',
          light: '#E8F5EE'
        },
        action: {
          DEFAULT: '#E06C1F',
          soft: '#FDF0E7'
        },
        success: '#1F7A4C',
        danger: '#B42318',
        accent: '#E06C1F',
        muted: '#57534E',
        bg: '#F7F4EF',
        surface: '#FFFFFF'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
