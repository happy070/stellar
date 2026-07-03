/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand palette (Disney+ Hotstar inspired deep-blue / violet)
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        accent: '#1f80e0',
        // Semantic tokens resolved per-theme in the ThemeProvider,
        // kept here so Tailwind classes stay available too.
        night: {
          950: '#05060f',
          900: '#0b0d1a',
          850: '#12152b',
          800: '#171a33',
          700: '#20244a',
          600: '#2c3160',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
