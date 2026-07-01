import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Subject colors — consistent across both grade bands
        science:  { DEFAULT: '#22c55e', light: '#dcfce7', dark: '#15803d' },
        coding:   { DEFAULT: '#a855f7', light: '#f3e8ff', dark: '#7e22ce' },
        build:    { DEFAULT: '#f97316', light: '#ffedd5', dark: '#c2410c' },
        arts:     { DEFAULT: '#ec4899', light: '#fce7f3', dark: '#be185d' },
        math:     { DEFAULT: '#3b82f6', light: '#dbeafe', dark: '#1d4ed8' },
        reading:  { DEFAULT: '#eab308', light: '#fef9c3', dark: '#a16207' },
        // Brand
        keen: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
    },
  },
  safelist: [
    'bg-science', 'bg-science-light', 'text-science-dark', 'border-science',
    'bg-coding',  'bg-coding-light',  'text-coding-dark',  'border-coding',
    'bg-build',   'bg-build-light',   'text-build-dark',   'border-build',
    'bg-arts',    'bg-arts-light',    'text-arts-dark',    'border-arts',
    'bg-math',    'bg-math-light',    'text-math-dark',    'border-math',
    'bg-reading', 'bg-reading-light', 'text-reading-dark', 'border-reading',
    'bg-teal-500', 'bg-teal-50', 'text-teal-900', 'border-teal-500',
    'bg-orange-400', 'bg-orange-50', 'text-orange-900', 'border-orange-400',
    'bg-keen-500', 'bg-keen-100', 'text-keen-900', 'border-keen-500',
  ],
  plugins: [],
}

export default config
