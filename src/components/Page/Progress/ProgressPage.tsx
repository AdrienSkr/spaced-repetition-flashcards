import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect } from 'preact/hooks'
import { db } from '../../../models/db'
import { useListSelector } from '../../../contexts/ListSelectorContext'
import { getMasteryLevel, getMasteryLabel, isDue, MasteryLevel } from '../../../utils/sm2'
import { AlgorithmExplainer } from '../../Progress/AlgorithmExplainer'
import { MasteryBreakdown } from '../../Progress/MasteryBreakdown'
import { StatsCard } from '../../Progress/StatsCard'
import { Icon } from '../../shared/Icon'

export function ProgressPage() {
  const { selectedListId, setLists } = useListSelector()
  const lists = useLiveQuery(() => db.lists.toArray())

  useEffect(() => {
    if (lists) {
      setLists(lists)
    }
  }, [lists, setLists])

  const cards = useLiveQuery(
    () => selectedListId === 0
      ? db.cards.toArray()
      : db.cards.where({ listId: selectedListId }).toArray(),
    [selectedListId]
  )

  if (!cards || !lists) {
    return (
      <div class="flex min-h-[60vh] items-center justify-center">
        <div class="animate-pulse text-brand-500">Loading...</div>
      </div>
    )
  }

  const totalCards = cards.length
  const totalLists = lists.length

  const masteryCounts: Record<MasteryLevel, number> = { new: 0, learning: 0, review: 0, mastered: 0 }
  let totalReviews = 0
  let cardsWithReviews = 0

  cards.forEach((card) => {
    const level = getMasteryLevel(card.repetitions || 0, card.interval || 0)
    masteryCounts[level]++
    if (card.totalReviews && card.totalReviews > 0) {
      totalReviews += card.totalReviews
      cardsWithReviews++
    }
  })

  const dueNowCount = cards.filter((card) => isDue(card.nextReview || 0)).length
  const masteryPercentage = totalCards > 0 ? Math.round((masteryCounts.mastered / totalCards) * 100) : 0
  const avgReviews = cardsWithReviews > 0 ? Math.round(totalReviews / cardsWithReviews) : 0

  return (
    <div class="animate-fade-in space-y-6 pt-4">
      {/* Stats Grid */}
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard iconName="book" value={totalCards} label="Total Cards" color="primary" />
        <StatsCard iconName="target" value={`${masteryPercentage}%`} label="Mastery" color="success" />
        <StatsCard iconName="clock" value={dueNowCount} label="Due Now" color="warning" />
        <StatsCard iconName="folder" value={totalLists} label="Decks" color="info" />
      </div>

      {/* Main Content Grid */}
      <div class="grid gap-6 lg:grid-cols-2">
        <MasteryBreakdown counts={masteryCounts} total={totalCards} dueNowCount={dueNowCount} />

        {/* Additional Stats */}
        <div class="card-elevated p-6">
          <h3 class="section-title mb-4 flex items-center gap-2">
            <Icon name="trending-up" size={24} color="#78716c" />
            Learning Stats
          </h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-neutral-100 py-2">
              <span class="text-neutral-600">Average reviews per card</span>
              <span class="font-semibold text-neutral-900">{avgReviews}</span>
            </div>
            <div class="flex items-center justify-between border-b border-neutral-100 py-2">
              <div class="flex flex-col">
                <span class="text-neutral-600">{getMasteryLabel('learning')} cards</span>
                <span class="text-xs text-neutral-400">1-2 correct answers in a row</span>
              </div>
              <span class="font-semibold text-mastery-learning">{masteryCounts.learning}</span>
            </div>
            <div class="flex items-center justify-between border-b border-neutral-100 py-2">
              <div class="flex flex-col">
                <span class="text-neutral-600">{getMasteryLabel('review')} cards</span>
                <span class="text-xs text-neutral-400">3+ correct, interval &lt; 21 days</span>
              </div>
              <span class="font-semibold text-mastery-review">{masteryCounts.review}</span>
            </div>
            <div class="flex items-center justify-between py-2">
              <div class="flex flex-col">
                <span class="text-neutral-600">{getMasteryLabel('new')} cards</span>
                <span class="text-xs text-neutral-400">Never reviewed yet</span>
              </div>
              <span class="font-semibold text-neutral-500">{masteryCounts.new}</span>
            </div>
          </div>

          {dueNowCount > 0 && (
            <div class="mt-6 rounded-lg bg-warning-light p-4">
              <p class="flex items-start gap-2 text-sm text-warning">
                <Icon name="lightbulb" size={20} color="#f59e0b" class="mt-0.5 shrink-0" />
                <span>
                  <strong>Tip:</strong> You have {dueNowCount} card{dueNowCount > 1 ? 's' : ''} due for review. 
                  Regular reviews help retain information better!
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      <AlgorithmExplainer />
    </div>
  )
}
