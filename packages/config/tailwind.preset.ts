import type { Config } from 'tailwindcss';

const preset: Config = {
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        neutral: {
          0:   '#ffffff',
          50:  '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        surface: {
          base:    '#fafaf9',
          card:    '#ffffff',
          sunken:  '#f5f5f4',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(28,25,23,0.06), 0 1px 2px rgba(28,25,23,0.04)',
        'card-md': '0 4px 12px rgba(28,25,23,0.08), 0 2px 4px rgba(28,25,23,0.04)',
        'card-lg': '0 8px 24px rgba(28,25,23,0.10), 0 4px 8px rgba(28,25,23,0.06)',
        'bottom':  '0 -4px 12px rgba(28,25,23,0.08)',
      },
      animation: {
        'slide-up':   'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        'slide-down': 'slideDown 0.25s ease-out',
        'fade-in':    'fadeIn 0.2s ease-out',
        'pulse-ring': 'pulseRing 1.5s cubic-bezier(0.215,0.61,0.355,1) infinite',
        'bounce-in':  'bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'shimmer':    'shimmer 1.5s linear infinite',
      },
      keyframes: {
        slideUp:   { from: { transform: 'translateY(100%)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { from: { transform: 'translateY(-8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        pulseRing: { '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(249,115,22,0.5)' }, '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(249,115,22,0)' }, '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(249,115,22,0)' } },
        bounceIn:  { '0%': { transform: 'scale(0.8)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
};
export default preset;
