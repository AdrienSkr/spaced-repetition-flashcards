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
  const [freePracticeReviewedIds, setFreePracticeReviewedIds] = useState<
    Set<number>
  >(new Set())
  const [selectedDaysAhead, setSelectedDaysAhead] = useState<number>(1)

  useEffect(() => {
    setRetryQueue([])
    setFreePracticeReviewedIds(new Set())
  }, [list.id])

  useEffect(() => {
    if (!isFreePractice) {
      setFreePracticeReviewedIds(new Set())
    }
  }, [isFreePractice])

  const cards = useLiveQuery(async () => {
    const allCards =
      list.id === 0
        ? await db.cards.toArray()
        : await db.cards.where({ listId: list.id }).toArray()

    return allCards.sort((a, b) => {
      const aDue = isDue(a.nextReview || 0)
      const bDue = isDue(b.nextReview || 0)
      if (aDue && !bDue) return -1
      if (!aDue && bDue) return 1
      return (a.nextReview || 0) - (b.nextReview || 0)
    })
  }, [list.id])

  const dueCards = cards?.filter((card) => isDue(card.nextReview || 0)) || []
  const dueCardIds = new Set(
    dueCards.map((card) => card.id).filter((id): id is number => !!id),
  )
  const retryCards =
    cards?.filter(
      (card) =>
        card.id && retryQueue.includes(card.id) && !dueCardIds.has(card.id),
    ) || []

  const getFreePracticeCards = (): CardType[] => {
    if (!cards || freePracticeMode === 'off') return []
    if (freePracticeMode === 'all') {
      return cards.filter(
        (card) => card.id && !freePracticeReviewedIds.has(card.id),
      )
    }
    if (freePracticeMode === 'future') {
      const now = Date.now()
      const futureLimit = now + freePracticeDaysAhead * 24 * 60 * 60 * 1000
      return cards.filter(
        (card) =>
          card.id &&
          !freePracticeReviewedIds.has(card.id) &&
          card.nextReview &&
          card.nextReview > now &&
          card.nextReview <= futureLimit,
      )
    }
    return []
  }

  const freePracticeCards = getFreePracticeCards()
  const currentCard = isFreePractice
    ? freePracticeCards[0]
    : dueCards[0] || retryCards[0]

  const handleCardShow = () => {
    setStartTime(Date.now())
  }

  async function onAnswer(card: CardType, answerData: ModeAnswerData) {
    const dataWithTime: ModeAnswerData = {
      ...answerData,
      responseTimeMs: answerData.responseTimeMs ?? Date.now() - startTime,
    }

    if (isFreePractice) {
      if (card.id) {
        setFreePracticeReviewedIds((prev) => new Set([...prev, card.id!]))
      }
      handleCardShow()
      return
    }

    const quality = getQualityForMode(learningMode, dataWithTime)
    const result = calculateSM2(
      quality,
      card.repetitions || 0,
      card.easinessFactor || 2.5,
      card.interval || 0,
    )

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
        delay: result.interval,
        count: result.repetitions,
      })

      if (!dataWithTime.isCorrect) {
        setRetryQueue((prev) =>
          prev.includes(card.id!) ? prev : [...prev, card.id!],
        )
      } else {
        setRetryQueue((prev) => prev.filter((id) => id !== card.id))
      }
    }

    handleCardShow()
  }

  if (!cards) {
    return (
      <div class="flex min-h-[60vh] items-center justify-center">
        <div class="animate-pulse text-brand-500">Loading...</div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div class="flex min-h-[60vh] animate-fade-in flex-col items-center justify-center text-center">
        <div class="icon-container mb-6 rounded-lg bg-brand-100 p-4">
          <Icon name="empty-box" size={48} color="#0ea5e9" />
        </div>
        <h2 class="mb-2 text-xl font-semibold text-neutral-900">
          This deck is empty
        </h2>
        <p class="mb-6 max-w-md text-neutral-600">
          Add some cards to start learning. You can create flashcards with
          questions and answers.
        </p>
        {onAddCard && (
          <button onClick={onAddCard} class="btn-primary">
            <Icon name="plus" size={20} />
            Add Your First Card
          </button>
        )}
      </div>
    )
  }

  const getFutureCardsCount = (days: number): number => {
    if (!cards) return 0
    const now = Date.now()
    const futureLimit = now + days * 24 * 60 * 60 * 1000
    return cards.filter(
      (card) =>
        card.nextReview &&
        card.nextReview > now &&
        card.nextReview <= futureLimit,
    ).length
  }

  const totalRemaining = dueCards.length + retryCards.length

  if (isFreePractice && freePracticeCards.length === 0) {
    return (
      <div class="flex min-h-[60vh] animate-fade-in flex-col items-center justify-center text-center">
        <div class="icon-container mb-6 rounded-lg bg-brand-100 p-4">
          <Icon name="celebration" size={48} color="#0ea5e9" />
        </div>
        <h2 class="mb-2 text-xl font-semibold text-neutral-900">
          Practice complete!
        </h2>
        <p class="mb-6 max-w-md text-neutral-600">
          You've finished your free practice session.
          <span class="mt-2 block text-sm text-neutral-500">
            {freePracticeReviewedIds.size} card
            {freePracticeReviewedIds.size > 1 ? 's' : ''} reviewed (no progress
            saved)
          </span>
        </p>
        <button onClick={stopFreePractice} class="btn-primary">
          Back to normal mode
        </button>
      </div>
    )
  }

  if (totalRemaining === 0 && !isFreePractice) {
    return (
      <div class="flex min-h-[60vh] animate-fade-in flex-col items-center justify-center text-center">
        <div class="icon-container mb-6 rounded-lg bg-success-light p-4">
          <Icon name="celebration" size={48} color="#22c55e" />
        </div>
        <h2 class="mb-2 text-xl font-semibold text-neutral-900">
          All caught up!
        </h2>
        <p class="max-w-md text-neutral-600">
          You've reviewed all cards due for today. Great job!
          {cards.length > 0 && (
            <span class="mt-2 block text-sm text-brand-600">
              Next review: {getNextReviewText(cards)}
            </span>
          )}
        </p>

        {/* Free practice options */}
        <div class="mt-8 w-full max-w-sm space-y-4">
          <p class="text-sm font-medium text-neutral-500">
            Want to keep practicing?
          </p>

          <button
            onClick={() => startFreePractice('all')}
            class="card-interactive flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <div>
              <span class="font-medium text-neutral-900">Review all cards</span>
              <span class="ml-2 text-sm text-neutral-500">
                ({cards.length} cards)
              </span>
            </div>
            <svg
              class="size-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div class="card-elevated">
            <div class="flex items-center justify-between px-4 py-3">
              <div>
                <span class="font-medium text-neutral-900">
                  Review upcoming cards
                </span>
                <span class="ml-2 text-sm text-neutral-500">
                  ({getFutureCardsCount(selectedDaysAhead)} cards)
                </span>
              </div>
            </div>
            <div class="border-t border-neutral-100 px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="text-sm text-neutral-600">Next</span>
                <select
                  value={selectedDaysAhead}
                  onChange={(e) =>
                    setSelectedDaysAhead(
                      Number((e.target as HTMLSelectElement).value),
                    )
                  }
                  class="input w-auto py-1 text-sm"
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
                  class="btn-primary ml-auto py-1 text-sm"
                >
                  Start
                </button>
              </div>
            </div>
          </div>

          <p class="text-xs text-neutral-400">
            Free practice doesn't affect your progress or the SM2 algorithm.
          </p>
        </div>
      </div>
    )
  }

  const remainingCount = isFreePractice
    ? freePracticeCards.length
    : totalRemaining

  return (
    <div class="animate-fade-in">
      {/* Free practice banner */}
      {isFreePractice && (
        <div class="mb-4 flex items-center justify-between rounded-lg bg-warning-light px-4 py-2 text-warning">
          <div class="flex items-center gap-2">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="text-sm font-medium">
              Free practice mode
              {freePracticeMode === 'future' &&
                ` (next ${freePracticeDaysAhead} day${
                  freePracticeDaysAhead > 1 ? 's' : ''
                })`}
              {freePracticeMode === 'all' && ' (all cards)'}
            </span>
            <span class="text-xs">– Progress won't be saved</span>
          </div>
          <button
            onClick={stopFreePractice}
            class="rounded-md px-2 py-1 text-sm font-medium transition-colors duration-fast hover:bg-warning/20"
          >
            Exit
          </button>
        </div>
      )}

      {/* Progress indicator */}
      <div class="mb-4 flex items-center justify-center gap-4 text-sm text-neutral-500">
        <span>
          {remainingCount} card{remainingCount > 1 ? 's' : ''} remaining
          {isFreePractice && freePracticeReviewedIds.size > 0 && (
            <span class="ml-2 text-neutral-400">
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
  return getNextReviewTextFromSM2(nextCard.nextReview || 0)
}
