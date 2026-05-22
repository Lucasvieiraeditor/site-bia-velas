/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rosa: '#B8956A',
        'rosa-claro': '#EDE5D8',
        bege: '#E4D8C8',
        dourado: '#9E7A52',
        offwhite: '#F5EFE6',
        titulo: '#2A2118',
        subtexto: '#6B5A4E',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Raleway"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        rose: '0 4px 24px rgba(184, 149, 106, 0.22)',
        'rose-lg': '0 8px 40px rgba(184, 149, 106, 0.36)',
        soft: '0 2px 16px rgba(42, 33, 24, 0.08)',
        'soft-lg': '0 8px 32px rgba(42, 33, 24, 0.13)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.8s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
