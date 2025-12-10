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
          DEFAULT: '#2D6EF8',
          dark: '#1749C6',
          light: '#E8F0FF'
        },
        success: '#16A34A',
        danger: '#DC2626',
        accent: '#F97316',
        muted: '#9CA3AF',
        bg: '#F9FAFB',
        surface: '#FFFFFF'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
