/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primaire : Bleu/Teal moderne
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Couleur principale
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Neutres : Gris chauds
        neutral: {
          50: '#fafaf9',   // Fond
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',  // Texte secondaire
          600: '#57534e',
          700: '#44403c',  // Texte sombre
          800: '#292524',
          900: '#1c1917',
        },
        // Surface colors
        surface: {
          bg: '#fafaf9',
          card: '#ffffff',
          elevated: '#ffffff',
          muted: '#f5f5f4',
        },
        // Status colors
        success: {
          DEFAULT: '#22c55e',
          light: '#dcfce7',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          dark: '#b45309',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
        },
        // Mastery level colors
        mastery: {
          new: '#e7e5e4',
          learning: '#fbbf24',
          review: '#38bdf8',
          mastered: '#22c55e',
        },
      },
      // Border radius standardisé
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'card': '12px',
      },
      // Shadows : 3 niveaux seulement
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'lg': '0 10px 20px rgba(0, 0, 0, 0.1)',
      },
      // Transitions standardisées
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
      },
      // Spacing cohérent (déjà par défaut dans Tailwind, on garde le standard)
      // 1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-success': 'pulseSuccess 0.6s ease-out',
        'bounce-in': 'bounceIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        pulseSuccess: {
          '0%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
          '70%': { boxShadow: '0 0 0 20px rgba(34, 197, 94, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
