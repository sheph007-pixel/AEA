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
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0a1f33',
        },
        slate: {
          750: '#293548',
        },
        accent: {
          50: '#eff8f4',
          100: '#d1eddf',
          200: '#a3dbbf',
          300: '#6ec49e',
          400: '#44a87e',
          500: '#2d8a63',
          600: '#236e4f',
          700: '#1c5840',
          800: '#164432',
          900: '#113627',
        },
        warm: {
          50: '#fdf8f0',
          100: '#f9edd9',
          200: '#f2d9b0',
          300: '#e8c080',
          400: '#dda654',
          500: '#d4912f',
          600: '#b87824',
          700: '#965f1e',
          800: '#7a4d1c',
          900: '#653f1a',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
          '"Helvetica Neue"', 'Arial', 'sans-serif',
        ],
        display: [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
          '"Helvetica Neue"', 'Arial', 'sans-serif',
        ],
      },
      fontSize: {
        '4.5xl': ['2.5rem', { lineHeight: '1.15' }],
        '5.5xl': ['3.375rem', { lineHeight: '1.1' }],
      },
    },
  },
  plugins: [],
};
export default config;
