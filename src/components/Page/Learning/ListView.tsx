import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'preact/hooks'
import { Card as CardType } from '../../../models/Card'
import { db } from '../../../models/db'
import { List } from '../../../models/List'
import {
  calculateSM2,
  getQualityForMode,
  getNextReviewText as getNextReviewTextFromSM2,
  isDue,
  ModeAnswerData,
} from '../../../utils/sm2'
import { CardContainer } from './Card/CardContainer'
import { useLearningContext } from './LearningContext'
import { Icon } from '../../shared/Icon'

interface ListViewProps {
  list: List
  onAddCard?: () => void
}

export function ListView({ list, onAddCard }: ListViewProps) {
  const { learningMode } = useLearningContext()
  const [startTime, setStartTime] = useState<number>(Date.now())

  // Fetch cards that are due for review
  const cards = useLiveQuery(async () => {
    // If list.id === 0, fetch all cards, otherwise filter by listId
    const allCards = list.id === 0
      ? await db.cards.toArray()
      : await db.cards.where({ listId: list.id }).toArray()

    // Sort by: due cards first, then by nextReview date
    return allCards.sort((a, b) => {
      const aDue = isDue(a.nextReview || 0)
      const bDue = isDue(b.nextReview || 0)

      if (aDue && !bDue) return -1
      if (!aDue && bDue) return 1

      // Both due or both not due - sort by nextReview
      return (a.nextReview || 0) - (b.nextReview || 0)
    })
  }, [list.id])

  // Filter to get only due cards
  const dueCards = cards?.filter((card) => isDue(card.nextReview || 0)) || []
  const currentCard = dueCards[0]

  // Reset timer when card changes
  const handleCardShow = () => {
    setStartTime(Date.now())
  }

  async function onAnswer(card: CardType, answerData: ModeAnswerData) {
    // Add response time for typing mode if not already provided
    const dataWithTime: ModeAnswerData = {
      ...answerData,
      responseTimeMs: answerData.responseTimeMs ?? Date.now() - startTime,
    }

    // Calculate quality based on the current learning mode
    const quality = getQualityForMode(learningMode, dataWithTime)

    // Calculate new SM-2 values
    const result = calculateSM2(
      quality,
      card.repetitions || 0,
      card.easinessFactor || 2.5,
      card.interval || 0,
    )

    // Update card in database
    if (card.id) {
      await db.cards.update(card.id, {
        repetitions: result.repetitions,
        easinessFactor: result.easinessFactor,
        interval: result.interval,
        nextReview: result.nextReview,
        lastReviewed: Date.now(),
        totalReviews: (card.totalReviews || 0) + 1,
        correctStreak: dataWithTime.isCorrect
          ? (card.correctStreak || 0) + 1
          : 0,
        // Keep legacy fields updated for compatibility
        delay: result.interval,
        count: result.repetitions,
      })
    }

    // Reset timer for next card
    handleCardShow()
  }

  if (!cards) {
    return (
      <div class="flex min-h-[60vh] items-center justify-center">
        <div class="animate-pulse text-primary-500">Loading...</div>
      </div>
    )
  }

  // Empty deck state - no cards at all
  if (cards.length === 0) {
    return (
      <div class="flex min-h-[60vh] animate-fade-in flex-col items-center justify-center text-center">
        <div class="mb-6 flex size-24 items-center justify-center rounded-full bg-primary-100">
          <Icon name="empty-box" size={48} color="#8b5cf6" />
        </div>
        <h2 class="mb-2 text-2xl font-bold text-gray-900">
          This deck is empty
        </h2>
        <p class="mb-6 max-w-md text-gray-600">
          Add some cards to start learning. You can create flashcards with
          questions and answers.
        </p>
        {onAddCard && (
          <button
            onClick={onAddCard}
            class="btn-primary flex items-center gap-2"
          >
            <svg
              class="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Your First Card
          </button>
        )}
      </div>
    )
  }

  // All cards reviewed - deck has cards but none are due
  if (dueCards.length === 0) {
    return (
      <div class="flex min-h-[60vh] animate-fade-in flex-col items-center justify-center text-center">
        <div class="mb-6 flex size-24 items-center justify-center rounded-full bg-success-light">
          <Icon name="celebration" size={48} color="#22c55e" />
        </div>
        <h2 class="mb-2 text-2xl font-bold text-gray-900">All caught up!</h2>
        <p class="max-w-md text-gray-600">
          You've reviewed all cards due for today. Great job!
          {cards.length > 0 && (
            <span class="mt-2 block text-sm text-primary-600">
              Next review: {getNextReviewText(cards)}
            </span>
          )}
        </p>
      </div>
    )
  }

  return (
    <div class="animate-fade-in">
      {/* Progress indicator */}
      <div class="mb-4 flex items-center justify-center gap-4 text-sm text-gray-500">
        <span>
          {dueCards.length} card{dueCards.length > 1 ? 's' : ''} remaining
        </span>
      </div>

      {currentCard && (
        <CardContainer
          card={currentCard}
          listId={list.id!}
          onAnswer={onAnswer}
        />
      )}
    </div>
  )
}

function getNextReviewText(cards: CardType[]): string {
  const futureCards = cards.filter(
    (c) => c.nextReview && c.nextReview > Date.now(),
  )
  if (futureCards.length === 0) return 'No upcoming reviews'

  const nextCard = futureCards.sort(
    (a, b) => (a.nextReview || 0) - (b.nextReview || 0),
  )[0]
  const nextReviewTime = nextCard.nextReview || 0

  // Use the SM2 utility function to format the timestamp
  return getNextReviewTextFromSM2(nextReviewTime)
}
