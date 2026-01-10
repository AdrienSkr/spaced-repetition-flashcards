import { useLiveQuery } from 'dexie-react-hooks'
import { Card } from '../../../models/Card'
import { db } from '../../../models/db'
import { List } from '../../../models/List'
import { getMasteryLevel } from '../../../utils/sm2'
import { Icon } from '../../shared/Icon'

type Props = {
  list: List
}

export function CardsView({ list }: Props) {
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

  return (
    <div class="animate-fade-in overflow-hidden rounded-2xl bg-surface-card shadow-soft">
      {/* Header */}
      <div class="grid grid-cols-[60px_1fr_1fr_100px] gap-4 border-b border-primary-100 bg-primary-50 px-6 py-4">
        <div class="text-sm font-semibold text-primary-700">ID</div>
        <div class="text-sm font-semibold text-primary-700">Question</div>
        <div class="text-sm font-semibold text-primary-700">Answer</div>
        <div class="text-sm font-semibold text-primary-700">Status</div>
      </div>
      
      {/* Rows */}
      <div class="divide-y divide-gray-100">
        {cards.map((card) => {
          const mastery = getMasteryLevel(card.repetitions || 0, card.interval || 0)
          const masteryColors = {
            new: 'bg-mastery-new text-gray-600',
            learning: 'bg-mastery-learning text-gray-800',
            review: 'bg-mastery-review text-white',
            mastered: 'bg-mastery-mastered text-white',
          }
          
          return (
            <div 
              key={card.id} 
              class="grid grid-cols-[60px_1fr_1fr_100px] gap-4 px-6 py-4 transition-colors hover:bg-primary-50"
            >
              <div class="text-sm text-gray-400">{card.id}</div>
              <div class="truncate text-gray-900" title={card.question}>
                {card.question}
              </div>
              <div class="truncate text-gray-600" title={card.answer}>
                {card.answer}
              </div>
              <div>
                <span class={`rounded-full px-2 py-1 text-xs font-medium capitalize ${masteryColors[mastery]}`}>
                  {mastery}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
