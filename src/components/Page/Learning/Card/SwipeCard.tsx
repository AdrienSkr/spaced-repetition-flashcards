import { useEffect, useState } from 'preact/hooks'
import { Card as CardType } from '../../../../models/Card'
import { getMasteryLevel, ModeAnswerData } from '../../../../utils/sm2'
import { ActionBar } from './ActionBar'
import { Modal } from '../../../shared/Modal'
import { AddCardModalContent } from '../../../Modals/AddCardModal'
import { EditCardModalContent } from '../../../Modals/EditCardModal'

interface Props {
  card: CardType
  listId: number
  onAnswer: (card: CardType, answerData: ModeAnswerData) => void
  onCardUpdated?: () => void
}

export function SwipeCard({ card, listId, onAnswer, onCardUpdated }: Props) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [animationClass, setAnimationClass] = useState('')

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [cardToEdit, setCardToEdit] = useState<CardType | null>(null)

  const masteryLevel = getMasteryLevel(
    card.repetitions || 0,
    card.interval || 0,
  )
  const masteryColors = {
    new: 'bg-mastery-new',
    learning: 'bg-mastery-learning',
    review: 'bg-mastery-review',
    mastered: 'bg-mastery-mastered',
  }

  useEffect(() => {
    setIsFlipped(false)
    setAnimationClass('')
  }, [card.id])

  const handleFlip = () => setIsFlipped(!isFlipped)

  const handleAnswer = (isCorrect: boolean) => {
    setAnimationClass(isCorrect ? 'answer-correct' : 'answer-incorrect')
    setTimeout(() => onAnswer(card, { isCorrect }), 200)
  }

  return (
    <>
      <div
        class={`
          relative mx-auto flex min-h-[65vh] w-full max-w-3xl flex-col items-center justify-center 
          rounded-lg bg-surface-card p-8 shadow-lg 
          transition-all duration-normal hover:shadow-lg
          ${animationClass}
        `}
      >
        {/* Mastery indicator */}
        <div class="absolute left-4 top-4">
          <div
            class={`size-3 rounded-full ${masteryColors[masteryLevel]}`}
            title={`Mastery: ${masteryLevel}`}
          />
        </div>

        {/* Mode indicator */}
        <div class="absolute right-4 top-4 text-xs uppercase tracking-wide text-brand-500">
          Swipe
        </div>

        <ActionBar
          card={card}
          listId={listId}
          onAddCard={() => setShowAddModal(true)}
          onEditCard={(c) => {
            setCardToEdit(c)
            setShowEditModal(true)
          }}
        />

        {!isFlipped ? (
          <div
            class="flex w-full cursor-pointer flex-col items-center gap-8"
            onClick={handleFlip}
          >
            <h3 class="text-center text-xl font-semibold leading-relaxed text-neutral-900 md:text-2xl">
              {card.question}
            </h3>
            <p class="text-sm text-neutral-400">Cliquez pour voir la réponse</p>
          </div>
        ) : (
          <div class="flex w-full flex-col items-center gap-8 animate-fade-in">
            <p class="text-center text-sm text-neutral-500">{card.question}</p>
            <h3 class="text-center text-xl font-semibold leading-relaxed text-brand-600 md:text-2xl">
              {card.answer}
            </h3>

            <div class="mt-4 flex gap-4">
              <button
                onClick={() => handleAnswer(false)}
                class="flex items-center gap-2 rounded-lg bg-error-light px-4 py-2 font-medium text-error 
                       transition-all duration-fast hover:bg-error hover:text-white active:scale-95"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Incorrect
              </button>
              <button
                onClick={() => handleAnswer(true)}
                class="flex items-center gap-2 rounded-lg bg-success-light px-4 py-2 font-medium text-success 
                       transition-all duration-fast hover:bg-success hover:text-white active:scale-95"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Correct
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Card"
        size="lg"
      >
        <AddCardModalContent
          listId={listId}
          onSuccess={() => {
            setShowAddModal(false)
            onCardUpdated?.()
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Card"
        size="lg"
      >
        {cardToEdit && (
          <EditCardModalContent
            card={cardToEdit}
            onSuccess={() => {
              setShowEditModal(false)
              setCardToEdit(null)
              onCardUpdated?.()
            }}
            onCancel={() => {
              setShowEditModal(false)
              setCardToEdit(null)
            }}
          />
        )}
      </Modal>
    </>
  )
}
