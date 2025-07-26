// tailwind.config.js
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sugarnest: {
          DEFAULT: '#D8A86A',   // màu chính – vàng nâu caramel ngọt dịu
          light: '#F5E3CE',     // nền nhạt
          dark: '#8B5E3C',      // màu chữ, điểm nhấn đậm
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
     fontFamily: {
  sans: ['Inter', 'sans-serif'],

      },
    },
  },
plugins: [require('tailwind-scrollbar-hide')],
};
