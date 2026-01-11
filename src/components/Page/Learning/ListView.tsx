import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'preact/hooks'
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
  const {
    learningMode,
    freePracticeMode,
    freePracticeDaysAhead,
    startFreePractice,
    stopFreePractice,
    isFreePractice,
  } = useLearningContext()
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [retryQueue, setRetryQueue] = useState<number[]>([])
  // Track reviewed cards in free practice mode (local state, not persisted)
  const [freePracticeReviewedIds, setFreePracticeReviewedIds] = useState<Set<number>>(new Set())
  // Days ahead selector state
  const [selectedDaysAhead, setSelectedDaysAhead] = useState<number>(1)

  // Reset retry queue and free practice state when list changes
  useEffect(() => {
    setRetryQueue([])
    setFreePracticeReviewedIds(new Set())
  }, [list.id])

  // Reset free practice reviewed cards when mode changes
  useEffect(() => {
    if (!isFreePractice) {
      setFreePracticeReviewedIds(new Set())
    }
  }, [isFreePractice])

  // Fetch cards that are due for review
  const cards = useLiveQuery(async () => {
    // If list.id === 0, fetch all cards, otherwise filter by listId
    const allCards =
      list.id === 0
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

  // Filter retry cards (cards in retryQueue that are not already in dueCards)
  const dueCardIds = new Set(
    dueCards.map((card) => card.id).filter((id): id is number => !!id),
  )
  const retryCards =
    cards?.filter(
      (card) =>
        card.id && retryQueue.includes(card.id) && !dueCardIds.has(card.id),
    ) || []

  // Free practice mode: get cards based on mode
  const getFreePracticeCards = (): CardType[] => {
    if (!cards || freePracticeMode === 'off') return []

    if (freePracticeMode === 'all') {
      // All cards, excluding already reviewed in this session
      return cards.filter((card) => card.id && !freePracticeReviewedIds.has(card.id))
    }

    if (freePracticeMode === 'future') {
      // Cards scheduled for the next X days
      const now = Date.now()
      const futureLimit = now + freePracticeDaysAhead * 24 * 60 * 60 * 1000
      return cards.filter(
        (card) =>
          card.id &&
          !freePracticeReviewedIds.has(card.id) &&
          card.nextReview &&
          card.nextReview > now &&
          card.nextReview <= futureLimit
      )
    }

    return []
  }

  const freePracticeCards = getFreePracticeCards()

  // Select current card: prioritize due cards, then retry cards, then free practice cards
  const currentCard = isFreePractice
    ? freePracticeCards[0]
    : dueCards[0] || retryCards[0]

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

    // In free practice mode, don't save to database - just move to next card
    if (isFreePractice) {
      if (card.id) {
        setFreePracticeReviewedIds((prev) => new Set([...prev, card.id!]))
      }
      handleCardShow()
      return
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

      // Manage retry queue: add incorrect cards, remove correct ones
      if (!dataWithTime.isCorrect) {
        // Add to retry queue if not already present
        setRetryQueue((prev) =>
          prev.includes(card.id!) ? prev : [...prev, card.id!],
        )
      } else {
        // Remove from retry queue if answered correctly
        setRetryQueue((prev) => prev.filter((id) => id !== card.id))
      }
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

  // Count future cards for the "future" mode
  const getFutureCardsCount = (days: number): number => {
    if (!cards) return 0
    const now = Date.now()
    const futureLimit = now + days * 24 * 60 * 60 * 1000
    return cards.filter(
      (card) => card.nextReview && card.nextReview > now && card.nextReview <= futureLimit
    ).length
  }

  // All cards reviewed - deck has cards but none are due and no retry cards
  const totalRemaining = dueCards.length + retryCards.length

  // Handle end of free practice session
  if (isFreePractice && freePracticeCards.length === 0) {
    return (
      <div class="flex min-h-[60vh] animate-fade-in flex-col items-center justify-center text-center">
        <div class="mb-6 flex size-24 items-center justify-center rounded-full bg-primary-100">
          <Icon name="celebration" size={48} color="#8b5cf6" />
        </div>
        <h2 class="mb-2 text-2xl font-bold text-gray-900">Practice complete!</h2>
        <p class="mb-6 max-w-md text-gray-600">
          You've finished your free practice session.
          <span class="mt-2 block text-sm text-gray-500">
            {freePracticeReviewedIds.size} card{freePracticeReviewedIds.size > 1 ? 's' : ''} reviewed (no progress saved)
          </span>
        </p>
        <button
          onClick={stopFreePractice}
          class="btn-primary"
        >
          Back to normal mode
        </button>
      </div>
    )
  }

  if (totalRemaining === 0 && !isFreePractice) {
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

        {/* Free practice options */}
        <div class="mt-8 w-full max-w-sm space-y-4">
          <p class="text-sm font-medium text-gray-500">Want to keep practicing?</p>
          
          {/* Review all cards */}
          <button
            onClick={() => startFreePractice('all')}
            class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <div>
              <span class="font-medium text-gray-900">Review all cards</span>
              <span class="ml-2 text-sm text-gray-500">({cards.length} cards)</span>
            </div>
            <svg class="size-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Review future cards */}
          <div class="rounded-lg border border-gray-200 bg-white">
            <div class="flex items-center justify-between px-4 py-3">
              <div>
                <span class="font-medium text-gray-900">Review upcoming cards</span>
                <span class="ml-2 text-sm text-gray-500">({getFutureCardsCount(selectedDaysAhead)} cards)</span>
              </div>
            </div>
            <div class="border-t border-gray-100 px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Next</span>
                <select
                  value={selectedDaysAhead}
                  onChange={(e) => setSelectedDaysAhead(Number((e.target as HTMLSelectElement).value))}
                  class="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value={1}>1 day</option>
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
                <button
                  onClick={() => startFreePractice('future', selectedDaysAhead)}
                  disabled={getFutureCardsCount(selectedDaysAhead) === 0}
                  class="ml-auto rounded-md bg-primary-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Start
                </button>
              </div>
            </div>
          </div>

          <p class="text-xs text-gray-400">
            Free practice doesn't affect your progress or the SM2 algorithm.
          </p>
        </div>
      </div>
    )
  }

  // Calculate remaining cards based on mode
  const remainingCount = isFreePractice ? freePracticeCards.length : totalRemaining

  return (
    <div class="animate-fade-in">
      {/* Free practice banner */}
      {isFreePractice && (
        <div class="mb-4 flex items-center justify-between rounded-lg bg-amber-50 px-4 py-2 text-amber-800">
          <div class="flex items-center gap-2">
            <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm font-medium">
              Free practice mode
              {freePracticeMode === 'future' && ` (next ${freePracticeDaysAhead} day${freePracticeDaysAhead > 1 ? 's' : ''})`}
              {freePracticeMode === 'all' && ' (all cards)'}
            </span>
            <span class="text-xs text-amber-600">– Progress won't be saved</span>
          </div>
          <button
            onClick={stopFreePractice}
            class="rounded px-2 py-1 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
          >
            Exit
          </button>
        </div>
      )}

      {/* Progress indicator */}
      <div class="mb-4 flex items-center justify-center gap-4 text-sm text-gray-500">
        <span>
          {remainingCount} card{remainingCount > 1 ? 's' : ''} remaining
          {isFreePractice && freePracticeReviewedIds.size > 0 && (
            <span class="ml-2 text-gray-400">
              ({freePracticeReviewedIds.size} reviewed)
            </span>
          )}
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
