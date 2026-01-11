# PairWise Cards - Technical Documentation

This document provides an in-depth look at the architecture, implementation details, and technical decisions behind PairWise Cards.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Data Models](#data-models)
- [Database Layer](#database-layer)
- [SM-2 Algorithm Implementation](#sm-2-algorithm-implementation)
- [Fill-in Heuristic Algorithm](#fill-in-heuristic-algorithm)
- [Context Management](#context-management)
- [Component Architecture](#component-architecture)
- [Development Tools](#development-tools)
- [Testing](#testing)
- [Build and Deployment](#build-and-deployment)

---

## Architecture Overview

PairWise Cards follows a component-based architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                         App Shell                           │
│  ┌─────────────┐  ┌─────────────────────┐  ┌─────────────┐  │
│  │   TopBar    │  │    Main Content     │  │  BottomBar  │  │
│  │  (Selector) │  │   (Page Router)     │  │   (Nav)     │  │
│  └─────────────┘  └─────────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │Learning │          │Collection│          │Progress │
   │  Page   │          │  Page    │          │  Page   │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │  Card   │          │ CardsView│         │  Stats  │
   │Components│         │ + Modals │          │Components│
   └────┬────┘          └────┬────┘          └─────────┘
        │                    │
        └────────────────────┘
                    │
              ┌─────▼─────┐
              │   Dexie   │
              │ IndexedDB │
              └───────────┘
```

### Key Principles

1. **Local-first**: All data is stored in IndexedDB, no backend required
2. **Reactive**: Uses Dexie's `useLiveQuery` for real-time data updates
3. **Modular**: Components are self-contained and reusable
4. **Type-safe**: Full TypeScript coverage with strict mode

---

## Technology Stack

| Layer            | Technology       | Rationale                          |
| ---------------- | ---------------- | ---------------------------------- |
| **UI Framework** | Preact 10.23     | 3KB React alternative, same API    |
| **Language**     | TypeScript 5.5   | Type safety, better DX             |
| **Styling**      | Tailwind CSS 3.4 | Utility-first, no CSS files        |
| **Database**     | Dexie 4.0        | IndexedDB wrapper with React hooks |
| **Build**        | Vite 5.4         | Fast HMR, optimized builds         |
| **Testing**      | Vitest           | Vite-native, fast execution        |
| **Linting**      | ESLint 9         | Code quality enforcement           |

---

## Project Structure

```
src/
├── main.tsx                    # App entry point, routing
├── style.css                   # Global styles, Tailwind imports
│
├── components/
│   ├── BottomBar/
│   │   └── BottomBar.tsx       # Bottom navigation (Learning/Collection/Progress)
│   │
│   ├── TopBar/
│   │   ├── TopBar.tsx          # Header with deck selector
│   │   └── Selector/           # Deck/mode selectors
│   │
│   ├── Page/
│   │   ├── Learning/
│   │   │   ├── LearningPage.tsx    # Main learning view
│   │   │   ├── LearningContext.tsx # Learning mode state
│   │   │   ├── ListView.tsx        # Card queue management
│   │   │   └── Card/               # Card components by mode
│   │   │       ├── CardContainer.tsx
│   │   │       ├── Card.tsx        # Typing mode
│   │   │       ├── SwipeCard.tsx   # Swipe mode
│   │   │       └── FillInCard.tsx  # Fill-in mode
│   │   │
│   │   ├── Collection/
│   │   │   ├── CollectionPage.tsx  # Deck/card management
│   │   │   └── CardsView.tsx       # Card list display
│   │   │
│   │   └── Progress/
│   │       └── ProgressPage.tsx    # Statistics dashboard
│   │
│   ├── Modals/
│   │   ├── AddCardModal.tsx
│   │   ├── CreateListModal.tsx
│   │   ├── DeckSettingsModal.tsx
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── EditCardModal.tsx
│   │   └── ImportCardsModal.tsx
│   │
│   ├── Progress/
│   │   ├── AlgorithmExplainer.tsx  # SM-2 explanation UI
│   │   ├── MasteryBreakdown.tsx    # Mastery level chart
│   │   └── StatsCard.tsx           # Stat display component
│   │
│   ├── Onboarding/
│   │   └── EmptyState.tsx          # First-time user experience
│   │
│   └── shared/
│       ├── Icon.tsx                # SVG icon component
│       └── Modal.tsx               # Reusable modal wrapper
│
├── contexts/
│   └── ListSelectorContext.tsx     # Selected deck state
│
├── models/
│   ├── Card.ts                     # Card interface
│   ├── List.ts                     # List/Deck interface
│   ├── db.ts                       # Dexie database setup
│   └── populate.ts                 # Dev mock data
│
├── utils/
│   ├── sm2.ts                      # SM-2 algorithm
│   ├── fillInHeuristic.ts          # Blank extraction logic
│   ├── fillInHeuristic.test.ts     # Algorithm tests
│   ├── levenshtein.ts              # String similarity
│   ├── devMode.ts                  # Dev utilities
│   └── is.ts                       # Type guards
│
├── config/
│   ├── env.ts                      # Environment config
│   └── theme.ts                    # Theme constants
│
└── assets/                         # SVG icons
```

---

## Data Models

### Card

```typescript
interface Card extends SM2CardData {
  id?: number // Auto-generated primary key
  question: string // Front of the card
  answer: string // Back of the card
  listId: number // Foreign key to List
}
```

### List (Deck)

```typescript
type ToleranceLevel = 'exact' | 'tolerant80' | 'tolerant60'

interface List {
  id?: number
  title: string
  toleranceLevel?: ToleranceLevel // Answer validation strictness
}
```

### SM2CardData

```typescript
interface SM2CardData {
  repetitions: number // Consecutive correct responses
  easinessFactor: number // Difficulty multiplier (default: 2.5)
  interval: number // Days until next review
  nextReview: number // Timestamp of next scheduled review
  lastReviewed: number // Timestamp of last review
  totalReviews: number // Lifetime review count
  correctStreak: number // Current streak of correct answers
}
```

---

## Database Layer

### Dexie Configuration

Located in `src/models/db.ts`:

```typescript
export const db = new Dexie('FlashcardsDataBase') as Dexie & {
  lists: EntityTable<List, 'id'>
  cards: EntityTable<Card, 'id'>
}

// Schema version 2 with SM-2 fields
db.version(2).stores({
  lists: '++id',
  cards: '++id,listId,nextReview',
})
```

### Indexes

- `cards.listId` - Query cards by deck
- `cards.nextReview` - Query due cards efficiently

### Migration

Version 2 adds SM-2 fields with automatic migration:

```typescript
.upgrade(async (tx) => {
  const cardsTable = tx.table<Card, number>('cards')
  const cards = await cardsTable.toArray()
  await Promise.all(
    cards.map(async (card) => {
      if (card.id && card.repetitions === undefined) {
        const sm2Data = getDefaultSM2Data()
        await cardsTable.update(card.id, sm2Data)
      }
    })
  )
})
```

### Reactive Queries

Using `useLiveQuery` from `dexie-react-hooks`:

```typescript
const cards = useLiveQuery(
  () =>
    selectedListId === 0
      ? db.cards.toArray()
      : db.cards.where({ listId: selectedListId }).toArray(),
  [selectedListId],
)
```

---

## SM-2 Algorithm Implementation

Located in `src/utils/sm2.ts`.

### Core Algorithm

```typescript
function calculateSM2(
  quality: number,      // 0-5 rating
  repetitions: number,  // Previous repetitions
  easinessFactor: number,
  interval: number
): SM2Result {
  // Update easiness factor
  let newEF = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  newEF = Math.max(1.3, newEF)  // Minimum 1.3

  if (quality < 3) {
    // Failed: reset
    return { repetitions: 0, interval: 1, ... }
  }

  // Success: increase interval
  if (repetitions === 0) interval = 1
  else if (repetitions === 1) interval = 6
  else interval = Math.round(interval * newEF)

  return { repetitions: repetitions + 1, interval, ... }
}
```

### Quality Rating by Mode

| Mode        | Correct Answer                 | Wrong Answer |
| ----------- | ------------------------------ | ------------ |
| **Typing**  | Q3-5 based on response time    | Q1           |
| **Swipe**   | Q5 (self-assessed)             | Q1           |
| **Fill-in** | Q2-5 based on % correct blanks | Q1           |

### Mastery Levels

```typescript
function getMasteryLevel(repetitions: number, interval: number): MasteryLevel {
  if (repetitions === 0 && interval === 0) return 'new'
  if (repetitions < 3) return 'learning'
  if (interval < 21) return 'review'
  return 'mastered'
}
```

---

## Fill-in Heuristic Algorithm

Located in `src/utils/fillInHeuristic.ts`.

### Purpose

Automatically extract key words from answers to create fill-in-the-blank exercises.

### Scoring System

Words are scored based on multiple factors:

| Factor             | Weight | Description                               |
| ------------------ | ------ | ----------------------------------------- |
| Proper noun        | 4-6    | Capitalized words (not at sentence start) |
| Numbers/dates      | 3      | Contains digits                           |
| Technical term     | 2-3    | Long or uncommon words                    |
| Quoted word        | 3      | Surrounded by quotes                      |
| All caps (acronym) | 3      | e.g., "NASA", "API"                       |
| Position           | 0-2    | End of sentence scores higher             |
| Length bonus       | 1-2    | Longer words preferred                    |
| Short word penalty | -1     | Words ≤ 3 chars                           |

### Word Selection

```typescript
function extractKeyWords(text: string, maxBlanks: number = 3): BlankWord[] {
  // 1. Extract all words via regex
  // 2. Filter common words (the, and, is, etc.)
  // 3. Score each word
  // 4. Select top-scoring with minimum distance constraint
  // 5. Apply fallbacks if needed
}
```

### Output Format

```typescript
interface FillInResult {
  textWithBlanks: string // "The capital is ___[1]___"
  blanks: BlankWord[] // [{ word: "Paris", startIndex: 15, endIndex: 20 }]
  originalText: string
}
```

---

## Context Management

### ListSelectorContext

Manages the currently selected deck across pages.

```typescript
interface ListSelectorContextType {
  lists: List[]
  selectedListId: number // 0 = "All Cards"
  setSelectedListId: (id: number) => void
  setLists: (lists: List[]) => void
}
```

### LearningContext

Manages learning mode and free practice state.

```typescript
interface LearningContextType {
  learningMode: 'typing' | 'swipe' | 'fillIn'
  setLearningMode: (mode: LearningMode) => void
  freePracticeMode: 'off' | 'all' | 'future'
  freePracticeDaysAhead: number
  startFreePractice: (mode, daysAhead?) => void
  stopFreePractice: () => void
  isFreePractice: boolean
}
```

**Persistence**: Learning mode is saved to `localStorage` under key `pairwise_learning_mode`.

---

## Component Architecture

### Card Components

```
CardContainer (mode router)
    │
    ├── Card.tsx (typing mode)
    │   └── Validates input with Levenshtein distance
    │
    ├── SwipeCard.tsx (swipe mode)
    │   └── Touch/mouse gesture handling
    │
    └── FillInCard.tsx (fill-in mode)
        └── Uses fillInHeuristic for blank generation
```

### Modal System

All modals use the shared `Modal` component:

```typescript
<Modal
  isOpen={boolean}
  onClose={() => void}
  title="string"
  size="sm" | "md" | "lg"
>
  <ModalContent />
</Modal>
```

---

## Development Tools

### Dev Toolbar

Available only in development mode (`import.meta.env.DEV`):

```typescript
// DevToolbarWrapper.tsx
export function DevToolbarWrapper() {
  if (!import.meta.env.DEV) return null
  // Lazy load DevToolbar
}
```

### Onboarding Test Mode

Activate with `?onboarding` URL parameter:

```typescript
if (isDev && window.location.search.includes('onboarding')) {
  enableOnboardingTestMode()
  Dexie.delete('FlashcardsDataBase')
}
```

Persistent via `localStorage.pairwise_onboarding_test_mode`.

### Dev Logging

```typescript
import { devLog } from './utils/devMode'

devLog.log('[Module] Message') // Only logs in DEV mode
devLog.warn('[Module] Warning')
```

---

## Testing

### Framework

- **Vitest** for unit testing
- **happy-dom** for DOM simulation

### Running Tests

```bash
npm run test        # Watch mode
npm run test:run    # Single run
npm run test:coverage  # With coverage
```

### Test Example

```typescript
// fillInHeuristic.test.ts
import { describe, it, expect } from 'vitest'
import { extractKeyWords, generateFillInBlanks } from './fillInHeuristic'

describe('extractKeyWords', () => {
  it('should extract proper nouns', () => {
    const result = extractKeyWords('Naruto Uzumaki is a ninja')
    expect(result.some((w) => w.word === 'Uzumaki')).toBe(true)
  })
})
```

---

## Build and Deployment

### Development

```bash
npm run dev  # Vite dev server with HMR
```

### Production Build

```bash
npm run build
# Output: dist/
```

Vite optimizations:

- Tree shaking (removes DevToolbar in prod)
- Code splitting
- Asset optimization

### GitHub Pages Deployment

```bash
npm run deploy
# Uses gh-pages to push dist/ to gh-pages branch
```

Configuration in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/pairWise-Cards/', // For GitHub Pages subdirectory
  plugins: [preact()],
})
```

---

## Performance Considerations

### Bundle Size

- Preact instead of React (~3KB vs ~40KB)
- Dexie for IndexedDB (no full ORM overhead)
- Tailwind with PurgeCSS (only used classes)

### Database Performance

- Indexed queries for `listId` and `nextReview`
- `useLiveQuery` with dependency arrays to avoid re-fetching

### Rendering

- Component-level state management (no global store)
- Conditional rendering for modals
- CSS animations via Tailwind (`animate-fade-in`)
