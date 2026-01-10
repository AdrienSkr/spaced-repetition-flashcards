/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors (customizable via theme.ts)
        primary: {
          50: 'var(--color-primary-50, #f5f3ff)',
          100: 'var(--color-primary-100, #ede9fe)',
          200: 'var(--color-primary-200, #ddd6fe)',
          300: 'var(--color-primary-300, #c4b5fd)',
          400: 'var(--color-primary-400, #a78bfa)',
          500: 'var(--color-primary-500, #8b5cf6)',
          600: 'var(--color-primary-600, #7c3aed)',
          700: 'var(--color-primary-700, #6d28d9)',
          800: 'var(--color-primary-800, #5b21b6)',
          900: 'var(--color-primary-900, #4c1d95)',
        },
        // Surface colors
        surface: {
          bg: 'var(--color-surface-bg, #faf5ff)',
          card: 'var(--color-surface-card, #ffffff)',
          elevated: 'var(--color-surface-elevated, #ffffff)',
          muted: 'var(--color-surface-muted, #f3f4f6)',
        },
        // Status colors
        success: 'var(--color-success, #22c55e)',
        'success-light': 'var(--color-success-light, #dcfce7)',
        error: 'var(--color-error, #ef4444)',
        'error-light': 'var(--color-error-light, #fee2e2)',
        warning: 'var(--color-warning, #f59e0b)',
        'warning-light': 'var(--color-warning-light, #fef3c7)',
        info: 'var(--color-info, #3b82f6)',
        'info-light': 'var(--color-info-light, #dbeafe)',
        // Mastery level colors
        mastery: {
          new: 'var(--color-mastery-new, #e5e7eb)',
          learning: 'var(--color-mastery-learning, #fbbf24)',
          review: 'var(--color-mastery-review, #60a5fa)',
          mastered: 'var(--color-mastery-mastered, #34d399)',
        },
      },
      boxShadow: {
        'soft': 'var(--shadow-md, 0 4px 6px rgba(139, 92, 246, 0.1))',
        'glow': 'var(--shadow-lg, 0 10px 25px rgba(139, 92, 246, 0.15))',
        'xl': 'var(--shadow-xl, 0 20px 40px rgba(139, 92, 246, 0.2))',
      },
      borderRadius: {
        'card': 'var(--radius-2xl, 1.5rem)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-success': 'pulseSuccess 0.6s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
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
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
