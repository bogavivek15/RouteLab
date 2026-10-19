/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        accent: {
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
        },
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          700: '#18181b',
          800: '#111113',
          850: '#0c0c0f',
          900: '#09090b',
          950: '#050506',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #e879f9 0%, #f97316 50%, #fbbf24 100%)',
        'gradient-brand-text': 'linear-gradient(90deg, #e879f9, #fb923c, #fbbf24)',
        'gradient-hero': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 80, 200, 0.15), transparent), radial-gradient(ellipse 60% 40% at 50% 0%, rgba(56, 189, 248, 0.08), transparent)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        'gradient-danger': 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(233,121,249,0.2), 0 0 60px rgba(249,115,22,0.1)',
        'glow-sm': '0 0 15px rgba(233,121,249,0.15)',
        'glow-lg': '0 0 50px rgba(233,121,249,0.25), 0 0 100px rgba(249,115,22,0.1)',
        'card': '0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3)',
        'elevated': '0 12px 40px rgba(0,0,0,0.5)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'aurora': 'aurora 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        aurora: {
          '0%, 100%': { opacity: '0.5', transform: 'translateY(0) scale(1)' },
          '50%': { opacity: '0.8', transform: 'translateY(-5%) scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
