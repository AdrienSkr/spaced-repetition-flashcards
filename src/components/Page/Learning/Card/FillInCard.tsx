import type { JSX } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'
import { Card as CardType } from '../../../../models/Card'
import { getMasteryLevel, ModeAnswerData } from '../../../../utils/sm2'
import {
  generateFillInBlanks,
  FillInResult,
} from '../../../../utils/fillInHeuristic'
import { isAnswerCorrect } from '../../../../utils/levenshtein'
import { useListSelector } from '../../../../contexts/ListSelectorContext'
import { ActionBar } from './ActionBar'
import { Modal } from '../../../shared/Modal'
import { AddCardModalContent } from '../../../Modals/AddCardModal'
import { EditCardModalContent } from '../../../Modals/EditCardModal'
import { devLog } from '../../../../utils/devMode'

interface Props {
  card: CardType
  listId: number
  onAnswer: (card: CardType, answerData: ModeAnswerData) => void
  onCardUpdated?: () => void
}

export function FillInCard({ card, listId, onAnswer, onCardUpdated }: Props) {
  const { selectedList } = useListSelector()
  const [answers, setAnswers] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([])
  const [animationClass, setAnimationClass] = useState('')

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [cardToEdit, setCardToEdit] = useState<CardType | null>(null)

  // Get tolerance level from deck settings
  const toleranceLevel = selectedList?.toleranceLevel || 'exact'

  // Generate blanks from the answer
  // Using card.id as well ensures recalculation when card changes
  const fillInData: FillInResult = useMemo(() => {
    devLog.log('[FillInCard] Generating blanks for answer:', card.answer)
    const result = generateFillInBlanks(card.answer, 3)
    devLog.log(
      '[FillInCard] Generated blanks:',
      result.blanks.map((b) => b.word),
    )
    return result
  }, [card.answer, card.id])

  // Get mastery level for visual indicator
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

  // Reset state when card changes
  useEffect(() => {
    setAnswers(new Array(fillInData.blanks.length).fill(''))
    setIsSubmitted(false)
    setCorrectAnswers([])
    setAnimationClass('')
  }, [card.id, fillInData.blanks.length])

  // Focus first input
  useEffect(() => {
    if (!isSubmitted) {
      const firstInput = document.getElementById('blank-0')
      if (firstInput) firstInput.focus()
    }
  }, [isSubmitted, card.id])

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (index < fillInData.blanks.length - 1) {
        // Move to next input
        const nextInput = document.getElementById(`blank-${index + 1}`)
        if (nextInput) nextInput.focus()
      } else {
        // Submit
        handleSubmit()
      }
    }
  }

  const handleSubmit = () => {
    if (answers.some((a) => !a.trim())) return

    // Check each answer
    const results = fillInData.blanks.map((blank, index) => {
      return isAnswerCorrect(answers[index], blank.word, toleranceLevel)
    })

    setCorrectAnswers(results)
    setIsSubmitted(true)

    const allCorrect = results.every((r) => r)
    setAnimationClass(allCorrect ? 'answer-correct' : 'answer-incorrect')
  }

  const handleContinue = () => {
    const correctCount = correctAnswers.filter((r) => r).length
    const allCorrect = correctAnswers.every((r) => r)

    // Fill-in mode: pass correctBlanks and totalBlanks for partial credit
    onAnswer(card, {
      isCorrect: allCorrect,
      correctBlanks: correctCount,
      totalBlanks: fillInData.blanks.length,
    })
  }

  const handleAddCard = () => {
    setShowAddModal(true)
  }

  const handleEditCard = (cardToEdit: CardType) => {
    setCardToEdit(cardToEdit)
    setShowEditModal(true)
  }

  // Render the text with blanks replaced by inputs
  const renderTextWithBlanks = () => {
    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0

    fillInData.blanks.forEach((blank, index) => {
      // Add text before this blank
      if (blank.startIndex > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {card.answer.slice(lastIndex, blank.startIndex)}
          </span>,
        )
      }

      // Add blank input or result
      if (isSubmitted) {
        const isCorrect = correctAnswers[index]
        parts.push(
          <span
            key={`blank-${index}`}
            class={`mx-1 inline-block rounded-lg px-2 py-1 font-bold
                    ${
                      isCorrect
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
          >
            {answers[index]}
            {!isCorrect && (
              <span class="ml-2 text-sm font-normal">→ {blank.word}</span>
            )}
          </span>,
        )
      } else {
        parts.push(
          <input
            key={`blank-${index}`}
            id={`blank-${index}`}
            type="text"
            value={answers[index] || ''}
            onInput={(e) => handleInputChange(index, e.currentTarget.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            class="mx-1 inline-block w-24 border-b-2 border-primary-400 bg-transparent px-2 py-1 
                   text-center font-medium transition-colors focus:border-primary-600
                   focus:outline-none"
            placeholder={`[${index + 1}]`}
            autoComplete="off"
          />,
        )
      }

      lastIndex = blank.endIndex
    })

    // Add remaining text
    if (lastIndex < card.answer.length) {
      parts.push(<span key="text-end">{card.answer.slice(lastIndex)}</span>)
    }

    return parts
  }

  return (
    <div
      class={`relative mx-auto flex min-h-[65vh] w-full max-w-3xl flex-col items-center justify-center 
              rounded-3xl bg-surface-card p-12 shadow-glow 
              transition-all duration-300 hover:shadow-xl
              ${animationClass}`}
    >
      {/* Mastery indicator */}
      <div class="absolute left-4 top-4">
        <div
          class={`size-3 rounded-full ${masteryColors[masteryLevel]}`}
          title={`Mastery: ${masteryLevel}`}
        />
      </div>

      {/* Mode indicator */}
      <div class="absolute right-4 top-4 text-xs uppercase tracking-wide text-primary-500">
        Fill-in
      </div>

      {/* ActionBar */}
      <ActionBar
        card={card}
        listId={listId}
        onAddCard={handleAddCard}
        onEditCard={handleEditCard}
      />

      {/* Question */}
      <h3 class="mb-8 text-center text-xl font-bold text-gray-900 md:text-2xl">
        {card.question}
      </h3>

      {/* Answer with blanks */}
      <div class="mb-8 text-center text-lg leading-relaxed text-gray-700">
        {renderTextWithBlanks()}
      </div>

      {/* Submit button or continue prompt */}
      {isSubmitted ? (
        <div class="mt-6 text-center">
          <p class="mb-4 text-sm text-gray-400">
            Press <kbd class="rounded bg-gray-100 px-2 py-1 text-xs">Enter</kbd>{' '}
            or click to continue
          </p>
          <button onClick={handleContinue} class="btn-primary">
            Continue
          </button>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={answers.some((a) => !a.trim())}
          class="btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check Answers
        </button>
      )}

      {/* Add Card Modal */}
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

      {/* Edit Card Modal */}
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
    </div>
  )
}
