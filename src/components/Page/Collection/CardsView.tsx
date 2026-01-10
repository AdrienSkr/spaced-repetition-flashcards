import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'preact/hooks'
import { Card } from '../../../models/Card'
import { db } from '../../../models/db'
import { List } from '../../../models/List'
import { getMasteryLevel, getMasteryLabel, getNextReviewText, isDue, MasteryLevel } from '../../../utils/sm2'
import { Icon } from '../../shared/Icon'

type Props = {
  list: List
}

type TabFilter = 'all' | 'due' | 'new' | 'learning' | 'review' | 'mastered'

interface TabConfig {
  id: TabFilter
  label: string
  color: string
  bgColor: string
}

const tabs: TabConfig[] = [
  { id: 'all', label: 'All', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  { id: 'due', label: 'Due Now', color: 'text-red-700', bgColor: 'bg-red-100' },
  { id: 'new', label: 'New', color: 'text-gray-600', bgColor: 'bg-mastery-new' },
  { id: 'learning', label: 'Consolidating', color: 'text-amber-700', bgColor: 'bg-mastery-learning' },
  { id: 'review', label: 'Reviewing', color: 'text-blue-700', bgColor: 'bg-mastery-review' },
  { id: 'mastered', label: 'Mastered', color: 'text-green-700', bgColor: 'bg-mastery-mastered' },
]

export function CardsView({ list }: Props) {
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  
  const cards = useLiveQuery(
    () =>
      list.id === 0
        ? db.cards.toArray()
        : db.cards.where({ listId: list.id }).toArray(),
    [list.id],
  )

  if (!cards) {
    return (
      <div class="flex items-center justify-center py-12">
        <div class="animate-pulse text-primary-500">Loading...</div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="mb-4 flex size-16 items-center justify-center rounded-full bg-primary-100">
          <Icon name="empty-box" size={32} color="#8b5cf6" />
        </div>
        <p class="text-gray-500">No cards in this deck yet</p>
      </div>
    )
  }

  // Calculate counts for each tab
  const counts: Record<TabFilter, number> = {
    all: cards.length,
    due: cards.filter(c => isDue(c.nextReview || 0)).length,
    new: cards.filter(c => getMasteryLevel(c.repetitions || 0, c.interval || 0) === 'new').length,
    learning: cards.filter(c => getMasteryLevel(c.repetitions || 0, c.interval || 0) === 'learning').length,
    review: cards.filter(c => getMasteryLevel(c.repetitions || 0, c.interval || 0) === 'review').length,
    mastered: cards.filter(c => getMasteryLevel(c.repetitions || 0, c.interval || 0) === 'mastered').length,
  }

  // Filter cards based on active tab
  const filteredCards = cards.filter(card => {
    if (activeTab === 'all') return true
    if (activeTab === 'due') return isDue(card.nextReview || 0)
    const mastery = getMasteryLevel(card.repetitions || 0, card.interval || 0)
    return mastery === activeTab
  })

  // Sort: due cards first (by nextReview), then by mastery level
  const sortedCards = [...filteredCards].sort((a, b) => {
    const aIsDue = isDue(a.nextReview || 0)
    const bIsDue = isDue(b.nextReview || 0)
    
    // Due cards come first
    if (aIsDue && !bIsDue) return -1
    if (!aIsDue && bIsDue) return 1
    
    // Among due cards, sort by nextReview (oldest first)
    if (aIsDue && bIsDue) {
      return (a.nextReview || 0) - (b.nextReview || 0)
    }
    
    // Among non-due cards, sort by nextReview (soonest first)
    return (a.nextReview || 0) - (b.nextReview || 0)
  })

  const masteryColors: Record<MasteryLevel, string> = {
    new: 'bg-mastery-new text-gray-600',
    learning: 'bg-mastery-learning text-gray-800',
    review: 'bg-mastery-review text-white',
    mastered: 'bg-mastery-mastered text-white',
  }

  return (
    <div class="animate-fade-in space-y-4">
      {/* Tabs */}
      <div class="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            class={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? `${tab.bgColor} ${tab.color} ring-2 ring-offset-1 ring-primary-300`
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {tab.label}
            <span class={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              activeTab === tab.id ? 'bg-white/30' : 'bg-gray-200'
            }`}>
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Cards Table */}
      <div class="overflow-hidden rounded-2xl bg-surface-card shadow-soft">
        {/* Header */}
        <div class="grid grid-cols-[60px_1fr_1fr_120px_100px] gap-4 border-b border-primary-100 bg-primary-50 px-6 py-4">
          <div class="text-sm font-semibold text-primary-700">ID</div>
          <div class="text-sm font-semibold text-primary-700">Question</div>
          <div class="text-sm font-semibold text-primary-700">Answer</div>
          <div class="text-sm font-semibold text-primary-700">Next Review</div>
          <div class="text-sm font-semibold text-primary-700">Status</div>
        </div>
        
        {/* Rows */}
        {sortedCards.length === 0 ? (
          <div class="px-6 py-8 text-center text-gray-500">
            No cards in this category
          </div>
        ) : (
          <div class="divide-y divide-gray-100">
            {sortedCards.map((card) => {
              const mastery = getMasteryLevel(card.repetitions || 0, card.interval || 0)
              const cardIsDue = isDue(card.nextReview || 0)
              
              return (
                <div 
                  key={card.id} 
                  class={`grid grid-cols-[60px_1fr_1fr_120px_100px] gap-4 px-6 py-4 transition-colors hover:bg-primary-50 ${
                    cardIsDue ? 'bg-red-50/50' : ''
                  }`}
                >
                  <div class="text-sm text-gray-400">{card.id}</div>
                  <div class="truncate text-gray-900" title={card.question}>
                    {card.question}
                  </div>
                  <div class="truncate text-gray-600" title={card.answer}>
                    {card.answer}
                  </div>
                  <div class={`text-sm ${cardIsDue ? 'font-medium text-red-600' : 'text-gray-500'}`}>
                    {getNextReviewText(card.nextReview || 0)}
                  </div>
                  <div>
                    <span class={`rounded-full px-2 py-1 text-xs font-medium ${masteryColors[mastery]}`}>
                      {getMasteryLabel(mastery)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
