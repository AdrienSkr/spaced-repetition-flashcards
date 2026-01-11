import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'preact/hooks'
import { Card } from '../../../models/Card'
import { db } from '../../../models/db'
import { List } from '../../../models/List'
import {
  getMasteryLevel,
  getMasteryLabel,
  getNextReviewText,
  isDue,
  MasteryLevel,
} from '../../../utils/sm2'
import { Icon } from '../../shared/Icon'
import { Modal } from '../../shared/Modal'
import { EditCardModalContent } from '../../Modals/EditCardModal'
import { DeleteConfirmModalContent } from '../../Modals/DeleteConfirmModal'

type Props = {
  list: List
  onAddCard?: () => void
}

type TabFilter = 'all' | 'due' | 'new' | 'learning' | 'review' | 'mastered'

interface TabConfig {
  id: TabFilter
  label: string
  color: string
  bgColor: string
}

const tabs: TabConfig[] = [
  {
    id: 'all',
    label: 'All',
    color: 'text-neutral-700',
    bgColor: 'bg-neutral-100',
  },
  {
    id: 'due',
    label: 'Due Now',
    color: 'text-warning-dark',
    bgColor: 'bg-warning-light',
  },
  {
    id: 'new',
    label: 'New',
    color: 'text-neutral-600',
    bgColor: 'bg-mastery-new',
  },
  {
    id: 'learning',
    label: 'Consolidating',
    color: 'text-neutral-800',
    bgColor: 'bg-mastery-learning',
  },
  {
    id: 'review',
    label: 'Reviewing',
    color: 'text-white',
    bgColor: 'bg-mastery-review',
  },
  {
    id: 'mastered',
    label: 'Mastered',
    color: 'text-white',
    bgColor: 'bg-mastery-mastered',
  },
]

export function CardsView({ list }: Props) {
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [deletingCard, setDeletingCard] = useState<Card | null>(null)

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
        <div class="animate-pulse text-brand-500">Loading...</div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="icon-container-md mb-4 rounded-lg bg-brand-100">
          <Icon name="empty-box" size={32} color="#0ea5e9" />
        </div>
        <p class="text-neutral-500">No cards in this deck yet</p>
      </div>
    )
  }

  // Calculate counts for each tab
  const counts: Record<TabFilter, number> = {
    all: cards.length,
    due: cards.filter((c) => isDue(c.nextReview || 0)).length,
    new: cards.filter(
      (c) => getMasteryLevel(c.repetitions || 0, c.interval || 0) === 'new',
    ).length,
    learning: cards.filter(
      (c) =>
        getMasteryLevel(c.repetitions || 0, c.interval || 0) === 'learning',
    ).length,
    review: cards.filter(
      (c) => getMasteryLevel(c.repetitions || 0, c.interval || 0) === 'review',
    ).length,
    mastered: cards.filter(
      (c) =>
        getMasteryLevel(c.repetitions || 0, c.interval || 0) === 'mastered',
    ).length,
  }

  // Filter cards based on active tab
  const filteredCards = cards.filter((card) => {
    if (activeTab === 'all') return true
    if (activeTab === 'due') return isDue(card.nextReview || 0)
    const mastery = getMasteryLevel(card.repetitions || 0, card.interval || 0)
    return mastery === activeTab
  })

  // Sort: due cards first (by nextReview), then by mastery level
  const sortedCards = [...filteredCards].sort((a, b) => {
    const aIsDue = isDue(a.nextReview || 0)
    const bIsDue = isDue(b.nextReview || 0)

    if (aIsDue && !bIsDue) return -1
    if (!aIsDue && bIsDue) return 1

    if (aIsDue && bIsDue) {
      return (a.nextReview || 0) - (b.nextReview || 0)
    }

    return (a.nextReview || 0) - (b.nextReview || 0)
  })

  const masteryColors: Record<MasteryLevel, string> = {
    new: 'bg-mastery-new text-neutral-600',
    learning: 'bg-mastery-learning text-neutral-800',
    review: 'bg-mastery-review text-white',
    mastered: 'bg-mastery-mastered text-white',
  }

  return (
    <div class="animate-fade-in space-y-4">
      {/* Tabs */}
      <div class="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            class={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-fast ${
              activeTab === tab.id
                ? `${tab.bgColor} ${tab.color} ring-2 ring-brand-300 ring-offset-1`
                : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            {tab.label}
            <span
              class={`ml-2 rounded-md px-2 py-0.5 text-xs ${
                activeTab === tab.id ? 'bg-white/30' : 'bg-neutral-200'
              }`}
            >
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Cards Table */}
      <div class="overflow-hidden rounded-lg bg-surface-card shadow-md">
        {/* Header */}
        <div class="grid grid-cols-[60px_1fr_1fr_120px_100px_80px] gap-4 border-b border-neutral-200 bg-neutral-50 px-6 py-3">
          <div class="text-sm font-semibold text-neutral-700">ID</div>
          <div class="text-sm font-semibold text-neutral-700">Question</div>
          <div class="text-sm font-semibold text-neutral-700">Answer</div>
          <div class="text-sm font-semibold text-neutral-700">Next Review</div>
          <div class="text-sm font-semibold text-neutral-700">Status</div>
          <div class="text-sm font-semibold text-neutral-700">Actions</div>
        </div>

        {/* Rows */}
        {sortedCards.length === 0 ? (
          <div class="px-6 py-8 text-center text-neutral-500">
            No cards in this category
          </div>
        ) : (
          <div class="divide-y divide-neutral-100">
            {sortedCards.map((card) => {
              const mastery = getMasteryLevel(
                card.repetitions || 0,
                card.interval || 0,
              )
              const cardIsDue = isDue(card.nextReview || 0)

              return (
                <div
                  key={card.id}
                  class={`grid grid-cols-[60px_1fr_1fr_120px_100px_80px] gap-4 px-6 py-3 transition-colors duration-fast hover:bg-brand-50 ${
                    cardIsDue ? 'bg-warning-light/50' : ''
                  }`}
                >
                  <div class="text-sm text-neutral-400">{card.id}</div>
                  <div class="truncate text-neutral-900" title={card.question}>
                    {card.question}
                  </div>
                  <div class="truncate text-neutral-600" title={card.answer}>
                    {card.answer}
                  </div>
                  <div
                    class={`text-sm ${
                      cardIsDue ? 'font-medium text-warning-dark' : 'text-neutral-500'
                    }`}
                  >
                    {getNextReviewText(card.nextReview || 0)}
                  </div>
                  <div>
                    <span
                      class={`rounded-md px-2 py-1 text-xs font-medium ${masteryColors[mastery]}`}
                    >
                      {getMasteryLabel(mastery)}
                    </span>
                  </div>
                  <div class="flex items-center gap-1">
                    <button
                      onClick={() => setEditingCard(card)}
                      class="rounded-md p-1 text-neutral-400 transition-colors duration-fast hover:bg-brand-100 hover:text-brand-600"
                      title="Edit"
                    >
                      <Icon name="edit" size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingCard(card)}
                      class="rounded-md p-1 text-neutral-400 transition-colors duration-fast hover:bg-error-light hover:text-error"
                      title="Delete"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Edit Card Modal */}
      <Modal
        isOpen={editingCard !== null}
        onClose={() => setEditingCard(null)}
        title="Edit Card"
      >
        {editingCard && (
          <EditCardModalContent
            card={editingCard}
            onSuccess={() => setEditingCard(null)}
            onCancel={() => setEditingCard(null)}
          />
        )}
      </Modal>

      {/* Delete Card Modal */}
      <Modal
        isOpen={deletingCard !== null}
        onClose={() => setDeletingCard(null)}
        title="Delete Card"
        size="sm"
      >
        {deletingCard && (
          <DeleteConfirmModalContent
            title="Delete this card?"
            message={`The card "${deletingCard.question.substring(0, 50)}${
              deletingCard.question.length > 50 ? '...' : ''
            }" will be permanently deleted.`}
            onConfirm={async () => {
              if (deletingCard.id) {
                await db.cards.delete(deletingCard.id)
              }
              setDeletingCard(null)
            }}
            onCancel={() => setDeletingCard(null)}
          />
        )}
      </Modal>
    </div>
  )
}
