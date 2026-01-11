/**
 * Theme Configuration
 * 
 * Design tokens centralisés pour l'application.
 * Palette : Bleu/Teal + Gris chauds
 */

export const themeConfig = {
  /**
   * Couleurs de marque (Bleu/Teal)
   * Utilisées pour les éléments interactifs, boutons, accents
   */
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

  /**
   * Couleurs neutres (Gris chauds)
   * Utilisées pour le texte, les bordures, les fonds
   */
  neutral: {
    50: '#fafaf9',   // Fond de page
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',  // Texte secondaire
    600: '#57534e',
    700: '#44403c',  // Texte principal
    800: '#292524',
    900: '#1c1917',
  },

  /**
   * Couleurs de surface
   * Utilisées pour les fonds, cartes, conteneurs
   */
  surface: {
    background: '#fafaf9',
    card: '#ffffff',
    elevated: '#ffffff',
    muted: '#f5f5f4',
  },

  /**
   * Couleurs de statut
   * Feedback et indication d'état
   */
  status: {
    success: '#22c55e',
    successLight: '#dcfce7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
  },

  /**
   * Couleurs de texte
   */
  text: {
    primary: '#44403c',
    secondary: '#78716c',
    muted: '#a8a29e',
    inverse: '#ffffff',
  },

  /**
   * Niveaux de maîtrise (spaced repetition)
   * Indicateurs visuels pour le niveau des cartes
   */
  mastery: {
    new: '#e7e5e4',
    learning: '#fbbf24',
    review: '#38bdf8',
    mastered: '#22c55e',
  },

  /**
   * Durées d'animation (ms)
   */
  animation: {
    fast: 150,
    normal: 250,
  },

  /**
   * Border radius
   */
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },

  /**
   * Shadows
   */
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
}
