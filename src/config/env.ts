/**
 * Environment Configuration
 * Differentiates between development and production modes
 */
export const config = {
    /** True if running in development mode */
    isDev: import.meta.env.DEV,

    /** True if running in production mode */
    isProd: import.meta.env.PROD,

    /** 
     * Whether to use mock data for development
     * 
     * To test onboarding in dev mode, create a .env.local file with:
     * VITE_MOCK_DATA=false
     * 
     * Or set this to false temporarily
     */
    useMockData: import.meta.env.VITE_MOCK_DATA !== 'false' && import.meta.env.DEV,

    /** Application version */
    version: '1.0.0',
}
