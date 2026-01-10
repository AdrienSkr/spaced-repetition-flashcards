/**
 * Dev Mode Configuration
 * 
 * Controls development-only features like onboarding testing
 */

const ONBOARDING_MODE_KEY = 'pairwise_onboarding_test_mode'

/**
 * Check if we're in development mode
 * Vite remplace import.meta.env.DEV par false en production
 */
export function isDevMode(): boolean {
    return import.meta.env.DEV
}

/**
 * Check if we're in onboarding test mode
 * This mode persists across page reloads
 */
export function isOnboardingTestMode(): boolean {
    if (!import.meta.env.DEV) return false
    return localStorage.getItem(ONBOARDING_MODE_KEY) === 'true'
}

/**
 * Enable onboarding test mode
 * Clears the database and prevents mock data from loading
 */
export function enableOnboardingTestMode(): void {
    if (!import.meta.env.DEV) return
    localStorage.setItem(ONBOARDING_MODE_KEY, 'true')
}

/**
 * Disable onboarding test mode
 * Returns to normal dev mode with mock data
 */
export function disableOnboardingTestMode(): void {
    if (!import.meta.env.DEV) return
    localStorage.removeItem(ONBOARDING_MODE_KEY)
}

/**
 * Toggle onboarding test mode
 */
export function toggleOnboardingTestMode(): boolean {
    if (isOnboardingTestMode()) {
        disableOnboardingTestMode()
        return false
    } else {
        enableOnboardingTestMode()
        return true
    }
}

/**
 * Logging utilities that only work in development mode
 * Vite éliminera ce code en production grâce au remplacement de import.meta.env.DEV
 */
export const devLog = {
    /**
     * Log only in development mode
     * Vite éliminera les appels à cette fonction en production
     */
    log: (...args: unknown[]): void => {
        if (import.meta.env.DEV) {
            console.log(...args)
        }
    },
    
    /**
     * Warn only in development mode
     * Vite éliminera les appels à cette fonction en production
     */
    warn: (...args: unknown[]): void => {
        if (import.meta.env.DEV) {
            console.warn(...args)
        }
    },
    
    /**
     * Error only in development mode
     * Vite éliminera les appels à cette fonction en production
     */
    error: (...args: unknown[]): void => {
        if (import.meta.env.DEV) {
            console.error(...args)
        }
    },
    
    /**
     * Group logs only in development mode
     * Vite éliminera les appels à cette fonction en production
     */
    group: (label: string): void => {
        if (import.meta.env.DEV) {
            console.group(label)
        }
    },
    
    /**
     * End group only in development mode
     * Vite éliminera les appels à cette fonction en production
     */
    groupEnd: (): void => {
        if (import.meta.env.DEV) {
            console.groupEnd()
        }
    },
}
