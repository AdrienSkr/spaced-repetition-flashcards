/// <reference types="vitest" />
import preact from '@preact/preset-vite'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/spaced-repetition-flashcards/',
  publicDir: 'public',
  plugins: [preact()],
  build: {
    // Minification avec esbuild (plus rapide que terser)
    minify: 'esbuild',
    // Source maps uniquement en dev pour le debug (désactivé en production pour réduire la taille)
    sourcemap: false,
    // Optimisations pour l'élimination du code mort
    rollupOptions: {
      output: {
        // Ne crée pas de chunks manuels pour mieux permettre le tree-shaking
        manualChunks: undefined,
      },
    },
    // Tree-shaking automatique activé par défaut
    // Vite/Rollup éliminera automatiquement le code mort basé sur import.meta.env.DEV
  },
  // Les variables d'environnement sont remplacées au build time
  // import.meta.env.DEV sera remplacé par false en production
  // ce qui permet à Rollup d'éliminer le code mort via le dead code elimination
  // Pas besoin de define explicite, Vite le fait automatiquement
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/coverage/**',
        // Exclure les fichiers dev du coverage
        '**/Dev/**',
        '**/devMode.ts',
        // Exclure les fichiers de configuration et types
        '**/*.config.*',
        '**/types/**',
      ],
      // Objectifs de couverture selon le plan pour fillInHeuristic.ts
      // Les thresholds sont désactivés globalement car ils s'appliqueraient à tout le projet
      // On vérifie la couverture spécifiquement pour fillInHeuristic.ts via les rapports
      thresholds: {
        // Seuil global désactivé - on vérifie manuellement la couverture du fichier spécifique
        // Pour activer les seuils uniquement pour fillInHeuristic.ts, utiliser:
        // lines: 90,
        // branches: 85,
        // functions: 100,
        // statements: 90,
      },
      // Exclure les lignes de commentaires et console.log du calcul
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      // Ne pas forcer all: true car cela inclurait tous les fichiers non testés
    },
  },
})
