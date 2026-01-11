import { JSX } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { Card as CardType } from '../../../../models/Card'
import { getMasteryLevel, ModeAnswerData } from '../../../../utils/sm2'
import { isAnswerCorrect } from '../../../../utils/levenshtein'
import { Modal } from '../../../shared/Modal'
import { AddCardModalContent } from '../../../Modals/AddCardModal'
import { EditCardModalContent } from '../../../Modals/EditCardModal'
import { ActionBar } from './ActionBar'
import { useListSelector } from '../../../../contexts/ListSelectorContext'

interface Props {
  card: CardType
  listId: number
  onAnswer: (card: CardType, answerData: ModeAnswerData) => void
  onCardUpdated?: () => void
}

export function Card({ card, listId, onAnswer, onCardUpdated }: Props) {
  const { selectedList } = useListSelector()
  const [input, setInput] = useState<string>('')
  const [isAnswered, setIsAnswered] = useState<boolean>(false)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [animationClass, setAnimationClass] = useState<string>('')
  const startTimeRef = useRef<number>(Date.now())

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [cardToEdit, setCardToEdit] = useState<CardType | null>(null)

  const toleranceLevel = selectedList?.toleranceLevel || 'exact'
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
    if (isAnswered) {
      document.getElementById('card')?.focus()
    } else {
      document.getElementById('input')?.focus()
    }
  }, [isAnswered])

  useEffect(() => {
    setInput('')
    setIsAnswered(false)
    setIsCorrect(false)
    setAnimationClass('')
    startTimeRef.current = Date.now()
  }, [card.id])

  const handleKeyDown = (
    event: JSX.TargetedKeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter' && input.trim()) {
      const correct = isAnswerCorrect(input, card.answer, toleranceLevel)
      setIsAnswered(true)
      setIsCorrect(correct)
      setAnimationClass(correct ? 'answer-correct' : 'answer-incorrect')
    }
  }

  const changeCard = () => {
    const responseTimeMs = Date.now() - startTimeRef.current
    onAnswer(card, { isCorrect, responseTimeMs })
  }

  const onKeyDownCard = (event: JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      changeCard()
    }
  }

  return (
    <>
      <div
        id="card"
        onClick={isAnswered ? changeCard : undefined}
        onKeyDown={isAnswered ? onKeyDownCard : undefined}
        tabIndex={0}
        class={`
          relative mx-auto flex min-h-[65vh] w-full max-w-3xl flex-col items-center justify-center 
          rounded-lg bg-surface-card p-8 shadow-lg 
          transition-all duration-normal 
          hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-400 
          ${isAnswered ? 'cursor-pointer active:scale-[0.99]' : ''}
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
          Typing
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

        {isAnswered ? (
          <div class="flex animate-fade-in flex-col items-center gap-6">
            {isCorrect ? (
              <>
                <div class="icon-container mb-2 rounded-lg bg-success-light p-4">
                  <svg
                    class="size-10 text-success"
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
                </div>
                <h4 class="text-2xl font-semibold text-success">{input}</h4>
              </>
            ) : (
              <>
                <div class="icon-container mb-2 rounded-lg bg-error-light p-4">
                  <svg
                    class="size-10 text-error"
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
                </div>
                <div class="text-center">
                  <p class="mb-1 text-sm text-neutral-500">Correct answer:</p>
                  <h3 class="mb-4 text-xl font-semibold text-neutral-900">
                    {card.answer}
                  </h3>
                  <p class="text-lg text-error line-through">{input}</p>
                </div>
              </>
            )}
            <p class="mt-4 text-sm text-neutral-400">
              Press{' '}
              <kbd class="rounded-md bg-neutral-100 px-2 py-1 text-xs">
                Enter
              </kbd>{' '}
              or click to continue
            </p>
          </div>
        ) : (
          <div class="flex w-full max-w-lg flex-col items-center gap-8">
            <h3 class="text-center text-xl font-semibold leading-relaxed text-neutral-900 md:text-2xl">
              {card.question}
            </h3>
            <input
              id="input"
              class="input text-center text-lg"
              type="text"
              value={input}
              placeholder="Type your answer..."
              onInput={(e) => setInput(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
            />
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
