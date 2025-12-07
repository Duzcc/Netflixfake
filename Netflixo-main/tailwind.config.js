/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom Heights
      height: {
        header: '560px',
        rate: '400px',
      },

      // Enhanced Typography
      fontSize: {
        h1: '2.6rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Bebas Neue', 'Impact', 'sans-serif'],
      },

      // Responsive Breakpoints
      screens: {
        xs: '475px',
      },

      // Netflix-Inspired Premium Color Palette
      colors: {
        // Primary Colors
        main: '#141414',        // Deep Black
        subMain: '#E50914',     // Netflix Red
        dry: '#1F1F1F',         // Dark Surface

        // Accent Colors
        star: '#FFD700',        // Gold
        text: '#FFFFFF',        // Primary Text
        'text-secondary': '#B3B3B3', // Secondary Text
        border: '#333333',      // Subtle Border
        dryGray: '#E0D5D5',     // Light Gray

        // State Colors
        success: '#46D369',
        warning: '#FFAB00',
        error: '#E50914',
        info: '#00B4D8',

        // Glassmorphism
        glass: 'rgba(255, 255, 255, 0.05)',
        'glass-dark': 'rgba(0, 0, 0, 0.2)',
      },

      // Enhanced Shadows
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 20px rgba(229, 9, 20, 0.4)',
        'glow-strong': '0 0 30px rgba(229, 9, 20, 0.6)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 20px 50px -5px rgba(0, 0, 0, 0.5)',
      },

      // Backdrop Blur (Glassmorphism)
      backdropBlur: {
        xs: '2px',
      },

      // Enhanced Keyframes
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
      },

      // Enhanced Animations
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        fadeIn: 'fadeIn 0.5s ease-in-out',
        fadeInUp: 'fadeInUp 0.6s ease-out',
        fadeInDown: 'fadeInDown 0.6s ease-out',
        slideInLeft: 'slideInLeft 0.5s ease-out',
        slideInRight: 'slideInRight 0.5s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },

      // Transition Utilities
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },

      // Custom Utilities for Glassmorphism
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'hero-gradient': 'linear-gradient(to right, rgba(20, 20, 20, 0.95) 0%, transparent 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // Custom plugin for glassmorphism utility classes
    function ({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        '.glass-card': {
          background: 'rgba(31, 31, 31, 0.4)',
          backdropFilter: 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};

