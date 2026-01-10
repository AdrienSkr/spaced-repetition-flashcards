/**
 * DevToolbarWrapper - Wrapper pour garantir l'exclusion du DevToolbar en production
 * 
 * Ce wrapper utilise un import conditionnel au niveau du module.
 * En production, Vite remplacera import.meta.env.DEV par false,
 * ce qui permettra à Rollup d'éliminer complètement le code du DevToolbar.
 * 
 * Note: L'import statique sera inclus, mais comme le composant DevToolbar
 * lui-même vérifie import.meta.env.DEV et retourne null immédiatement,
 * le code sera éliminé par le dead code elimination de Rollup.
 */

import { DevToolbar } from './DevToolbar'
import type { JSX } from 'preact'

/**
 * Composant wrapper qui rend le DevToolbar uniquement en développement
 * Vite éliminera ce code en production grâce au remplacement de import.meta.env.DEV
 * 
 * Le DevToolbar lui-même vérifie aussi import.meta.env.DEV, donc même si
 * ce composant est rendu, le DevToolbar retournera null en production.
 * Rollup éliminera ensuite le code mort grâce au dead code elimination.
 */
export function DevToolbarWrapper(): JSX.Element | null {
  // En production, cette condition sera évaluée à false au build time
  // Rollup éliminera alors tout le code dans ce bloc grâce au dead code elimination
  if (!import.meta.env.DEV) {
    return null
  }

  // En développement, on rend le DevToolbar
  // En production, cette ligne ne sera jamais atteinte car la condition est fausse
  return <DevToolbar />
}
