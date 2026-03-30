import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#c0392b',
          'red-dark': '#a5311f',
          'red-light': '#e74c3c',
        },
        ink: {
          900: '#111111',
          800: '#1a1a1a',
          700: '#2d2d2d',
          600: '#444444',
          500: '#666666',
          400: '#888888',
          300: '#aaaaaa',
          200: '#cccccc',
          100: '#e5e5e5',
          50: '#f5f5f5',
        },
      },
      fontFamily: {
        serif: ['Georgia', '"Times New Roman"', 'Times', 'serif'],
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
          '"Helvetica Neue"', 'Arial', 'sans-serif',
        ],
      },
      fontSize: {
        '4.5xl': ['2.5rem', { lineHeight: '1.12' }],
        '5xl': ['3rem', { lineHeight: '1.08' }],
        '5.5xl': ['3.5rem', { lineHeight: '1.06' }],
        '6xl': ['4rem', { lineHeight: '1.04' }],
      },
      maxWidth: {
        'article': '42rem',
      },
    },
  },
  plugins: [],
};
export default config;
