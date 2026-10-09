/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A365D', // Deep Collegiate Oxford Navy
          dark: '#0F2442',
          light: '#2A4D80',
          subtle: '#EFF6FF',
        },
        secondary: {
          DEFAULT: '#334E68', // Slate Blue Academic
          dark: '#243B53',
          light: '#627D98',
        },
        accent: {
          DEFAULT: '#D97706', // Campus Amber Gold
          light: '#F59E0B',
          subtle: '#FEF3C7',
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
        'surface-muted': '#F1F5F9',
        text: '#0F172A',
        muted: '#475569',
        'muted-light': '#94A3B8',
        success: {
          DEFAULT: '#16A34A',
          subtle: '#DCFCE7',
        },
        warning: {
          DEFAULT: '#D97706',
          subtle: '#FEF3C7',
        },
        danger: {
          DEFAULT: '#DC2626',
          subtle: '#FEE2E2',
        },
        border: {
          DEFAULT: '#E2E8F0',
          strong: '#CBD5E1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
