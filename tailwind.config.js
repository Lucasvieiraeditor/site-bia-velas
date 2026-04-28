/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rosa: '#F2A7BB',
        'rosa-claro': '#FDE8EE',
        bege: '#F5EDE4',
        dourado: '#C9A96E',
        offwhite: '#FAFAF8',
        titulo: '#2C2C2C',
        subtexto: '#8C7B75',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        rose: '0 4px 24px rgba(242, 167, 187, 0.25)',
        'rose-lg': '0 8px 40px rgba(242, 167, 187, 0.4)',
        soft: '0 2px 16px rgba(44, 44, 44, 0.08)',
        'soft-lg': '0 8px 32px rgba(44, 44, 44, 0.12)',
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
