import Dexie, { type EntityTable } from 'dexie'
import { Card } from './Card'
import { List } from './List'
import { isOnboardingTestMode, enableOnboardingTestMode, devLog } from '../utils/devMode'

export const db = new Dexie('FlashcardsDataBase') as Dexie & {
  lists: EntityTable<List, 'id'>
  cards: EntityTable<Card, 'id'>
}

// Schema version 1 - initial schema without SM-2 fields
db.version(1).stores({
  lists: '++id',
  cards: '++id,listId',
})

// Schema version 2 - add SM-2 fields (nextReview index for querying due cards)
db.version(2).stores({
  lists: '++id',
  cards: '++id,listId,nextReview',
}).upgrade(async (tx) => {
  // Migration: add default SM-2 data to existing cards
  const { getDefaultSM2Data } = await import('../utils/sm2')
  const cardsTable = tx.table<Card, number>('cards')
  const cards = await cardsTable.toArray()
  await Promise.all(
    cards.map(async (card) => {
      // Only add SM-2 data if not already present
      if (card.id && (card.repetitions === undefined || card.repetitions === null)) {
        const sm2Data = getDefaultSM2Data()
        await cardsTable.update(card.id, sm2Data)
      }
    })
  )
})

const isDev = import.meta.env.DEV

/**
 * Handle ?onboarding URL parameter
 * This activates persistent onboarding test mode
 */
if (isDev && window.location.search.includes('onboarding')) {
  // Enable persistent onboarding mode
  enableOnboardingTestMode()

  // Clear the database
  Dexie.delete('FlashcardsDataBase').then(() => {
    devLog.log('[TEST] Onboarding test mode ENABLED - Database cleared')
    // Remove the URL parameter but stay in onboarding mode
    const cleanUrl = window.location.pathname
    window.history.replaceState({}, '', cleanUrl)
    window.location.reload()
  })
}

/**
 * Normal initialization
 * Only populate mock data if NOT in onboarding test mode
 */
if (isDev && !isOnboardingTestMode()) {
  db.on('populate', async () => {
    devLog.log('[DEV] Dev mode: Loading mock data...')
    const { populate } = await import('./populate')
    await populate()
  })
}

// Log current mode - Vite éliminera ce bloc en production car isDev sera false
if (isDev) {
  if (isOnboardingTestMode()) {
    devLog.log('[TEST] ONBOARDING TEST MODE ACTIVE - No mock data will be loaded')
    devLog.log('   To exit: Run in console: localStorage.removeItem("pairwise_onboarding_test_mode"); location.reload()')
  } else {
    devLog.log('[DEV] Normal dev mode - Mock data will be loaded if DB is empty')
    devLog.log('   To test onboarding: Go to ?onboarding')
  }
}
