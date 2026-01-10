/**
 * Theme Configuration
 * 
 * Easily customize the application's color scheme and design tokens.
 * All colors follow the HSL format for easy theming.
 * 
 * To change the theme:
 * 1. Modify the colors below
 * 2. The entire app will automatically update
 */

export const themeConfig = {
    /**
     * Primary brand colors
     * Used for main interactive elements, buttons, and accents
     */
    primary: {
        50: '#f5f3ff',   // Lightest - backgrounds
        100: '#ede9fe',  // Light - hover states
        200: '#ddd6fe',  // Subtle borders
        300: '#c4b5fd',  // Muted elements
        400: '#a78bfa',  // Secondary actions
        500: '#8b5cf6',  // Main brand color
        600: '#7c3aed',  // Hover state for main
        700: '#6d28d9',  // Active/pressed state
        800: '#5b21b6',  // Dark variant
        900: '#4c1d95',  // Darkest variant
    },

    /**
     * Surface colors
     * Used for backgrounds, cards, and containers
     */
    surface: {
        background: '#faf5ff',  // Page background (slight purple tint)
        card: '#ffffff',        // Card backgrounds
        elevated: '#ffffff',    // Elevated surfaces (modals)
        muted: '#f3f4f6',       // Muted backgrounds
    },

    /**
     * Status colors
     * Used for feedback and state indication
     */
    status: {
        success: '#22c55e',     // Correct answers, positive actions
        successLight: '#dcfce7',
        error: '#ef4444',       // Wrong answers, errors
        errorLight: '#fee2e2',
        warning: '#f59e0b',     // Warnings, pending states
        warningLight: '#fef3c7',
        info: '#3b82f6',        // Information, tips
        infoLight: '#dbeafe',
    },

    /**
     * Text colors
     */
    text: {
        primary: '#1f2937',     // Main text
        secondary: '#6b7280',   // Secondary/muted text
        muted: '#9ca3af',       // Disabled, placeholder
        inverse: '#ffffff',     // Text on dark backgrounds
    },

    /**
     * Spaced repetition level colors
     * Visual indicators for card mastery levels
     */
    mastery: {
        new: '#e5e7eb',         // New cards (gray)
        learning: '#fbbf24',    // Learning phase (yellow)
        review: '#60a5fa',      // Review phase (blue)
        mastered: '#34d399',    // Mastered (green)
    },

    /**
     * Animation durations (ms)
     */
    animation: {
        fast: 150,
        normal: 300,
        slow: 500,
    },

    /**
     * Border radius tokens
     */
    radius: {
        sm: '0.375rem',    // 6px
        md: '0.5rem',      // 8px
        lg: '0.75rem',     // 12px
        xl: '1rem',        // 16px
        '2xl': '1.5rem',   // 24px
        full: '9999px',    // Pill shape
    },

    /**
     * Shadow tokens
     */
    shadows: {
        sm: '0 1px 2px rgba(139, 92, 246, 0.05)',
        md: '0 4px 6px rgba(139, 92, 246, 0.1)',
        lg: '0 10px 25px rgba(139, 92, 246, 0.15)',
        xl: '0 20px 40px rgba(139, 92, 246, 0.2)',
    },
}

/**
 * CSS Variables generation
 * Call this function to get CSS custom properties string
 */
export function generateCSSVariables(): string {
    return `
    :root {
      /* Primary colors */
      --color-primary-50: ${themeConfig.primary[50]};
      --color-primary-100: ${themeConfig.primary[100]};
      --color-primary-200: ${themeConfig.primary[200]};
      --color-primary-300: ${themeConfig.primary[300]};
      --color-primary-400: ${themeConfig.primary[400]};
      --color-primary-500: ${themeConfig.primary[500]};
      --color-primary-600: ${themeConfig.primary[600]};
      --color-primary-700: ${themeConfig.primary[700]};
      --color-primary-800: ${themeConfig.primary[800]};
      --color-primary-900: ${themeConfig.primary[900]};
      
      /* Surfaces */
      --color-surface-bg: ${themeConfig.surface.background};
      --color-surface-card: ${themeConfig.surface.card};
      --color-surface-elevated: ${themeConfig.surface.elevated};
      --color-surface-muted: ${themeConfig.surface.muted};
      
      /* Status */
      --color-success: ${themeConfig.status.success};
      --color-success-light: ${themeConfig.status.successLight};
      --color-error: ${themeConfig.status.error};
      --color-error-light: ${themeConfig.status.errorLight};
      --color-warning: ${themeConfig.status.warning};
      --color-warning-light: ${themeConfig.status.warningLight};
      --color-info: ${themeConfig.status.info};
      --color-info-light: ${themeConfig.status.infoLight};
      
      /* Text */
      --color-text-primary: ${themeConfig.text.primary};
      --color-text-secondary: ${themeConfig.text.secondary};
      --color-text-muted: ${themeConfig.text.muted};
      --color-text-inverse: ${themeConfig.text.inverse};
      
      /* Mastery levels */
      --color-mastery-new: ${themeConfig.mastery.new};
      --color-mastery-learning: ${themeConfig.mastery.learning};
      --color-mastery-review: ${themeConfig.mastery.review};
      --color-mastery-mastered: ${themeConfig.mastery.mastered};
      
      /* Animation */
      --animation-fast: ${themeConfig.animation.fast}ms;
      --animation-normal: ${themeConfig.animation.normal}ms;
      --animation-slow: ${themeConfig.animation.slow}ms;
      
      /* Radius */
      --radius-sm: ${themeConfig.radius.sm};
      --radius-md: ${themeConfig.radius.md};
      --radius-lg: ${themeConfig.radius.lg};
      --radius-xl: ${themeConfig.radius.xl};
      --radius-2xl: ${themeConfig.radius['2xl']};
      --radius-full: ${themeConfig.radius.full};
      
      /* Shadows */
      --shadow-sm: ${themeConfig.shadows.sm};
      --shadow-md: ${themeConfig.shadows.md};
      --shadow-lg: ${themeConfig.shadows.lg};
      --shadow-xl: ${themeConfig.shadows.xl};
    }
  `
}
