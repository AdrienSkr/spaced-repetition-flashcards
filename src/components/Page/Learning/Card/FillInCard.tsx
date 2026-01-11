import type { JSX } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'
import { Card as CardType } from '../../../../models/Card'
import { getMasteryLevel, ModeAnswerData } from '../../../../utils/sm2'
import { generateFillInBlanks, FillInResult } from '../../../../utils/fillInHeuristic'
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

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [cardToEdit, setCardToEdit] = useState<CardType | null>(null)

  const toleranceLevel = selectedList?.toleranceLevel || 'exact'

  const fillInData: FillInResult = useMemo(() => {
    devLog.log('[FillInCard] Generating blanks for answer:', card.answer)
    const result = generateFillInBlanks(card.answer, 3)
    devLog.log('[FillInCard] Generated blanks:', result.blanks.map((b) => b.word))
    return result
  }, [card.answer, card.id])

  const masteryLevel = getMasteryLevel(card.repetitions || 0, card.interval || 0)
  const masteryColors = {
    new: 'bg-mastery-new',
    learning: 'bg-mastery-learning',
    review: 'bg-mastery-review',
    mastered: 'bg-mastery-mastered',
  }

  useEffect(() => {
    setAnswers(new Array(fillInData.blanks.length).fill(''))
    setIsSubmitted(false)
    setCorrectAnswers([])
    setAnimationClass('')
  }, [card.id, fillInData.blanks.length])

  useEffect(() => {
    if (isSubmitted) {
      document.getElementById('fill-in-card')?.focus()
    } else {
      document.getElementById('blank-0')?.focus()
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
      e.stopPropagation()
      if (index < fillInData.blanks.length - 1) {
        document.getElementById(`blank-${index + 1}`)?.focus()
      } else {
        handleSubmit()
      }
    }
  }

  const handleSubmit = () => {
    if (answers.some((a) => !a.trim())) return

    const results = fillInData.blanks.map((blank, index) => isAnswerCorrect(answers[index], blank.word, toleranceLevel))
    setCorrectAnswers(results)
    setIsSubmitted(true)

    const allCorrect = results.every((r) => r)
    setAnimationClass(allCorrect ? 'answer-correct' : 'answer-incorrect')
  }

  const handleContinue = () => {
    const correctCount = correctAnswers.filter((r) => r).length
    const allCorrect = correctAnswers.every((r) => r)
    onAnswer(card, { isCorrect: allCorrect, correctBlanks: correctCount, totalBlanks: fillInData.blanks.length })
  }

  const handleCardKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && isSubmitted) {
      e.preventDefault()
      handleContinue()
    }
  }

  const renderTextWithBlanks = () => {
    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0

    fillInData.blanks.forEach((blank, index) => {
      if (blank.startIndex > lastIndex) {
        parts.push(<span key={`text-${index}`}>{card.answer.slice(lastIndex, blank.startIndex)}</span>)
      }

      if (isSubmitted) {
        const isCorrect = correctAnswers[index]
        parts.push(
          <span
            key={`blank-${index}`}
            class={`mx-1 inline-block rounded-md px-2 py-1 font-semibold ${isCorrect ? 'bg-success-light text-success' : 'bg-error-light text-error'}`}
          >
            {answers[index]}
            {!isCorrect && <span class="ml-2 text-sm font-normal">→ {blank.word}</span>}
          </span>
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
            class="mx-1 inline-block w-24 border-b-2 border-brand-400 bg-transparent px-2 py-1 
                   text-center font-medium transition-colors duration-fast focus:border-brand-600 focus:outline-none"
            placeholder={`[${index + 1}]`}
            autoComplete="off"
          />
        )
      }

      lastIndex = blank.endIndex
    })

    if (lastIndex < card.answer.length) {
      parts.push(<span key="text-end">{card.answer.slice(lastIndex)}</span>)
    }

    return parts
  }

  return (
    <div
      id="fill-in-card"
      tabIndex={0}
      onClick={isSubmitted ? handleContinue : undefined}
      onKeyDown={handleCardKeyDown}
      class={`relative mx-auto flex min-h-[65vh] w-full max-w-3xl flex-col items-center justify-center 
              rounded-lg bg-surface-card p-8 shadow-lg 
              transition-all duration-normal 
              hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-400
              ${isSubmitted ? 'cursor-pointer active:scale-[0.99]' : ''}
              ${animationClass}`}
    >
      {/* Mastery indicator */}
      <div class="absolute left-4 top-4">
        <div class={`size-3 rounded-full ${masteryColors[masteryLevel]}`} title={`Mastery: ${masteryLevel}`} />
      </div>

      {/* Mode indicator */}
      <div class="absolute right-4 top-4 text-xs uppercase tracking-wide text-brand-500">Fill-in</div>

      <ActionBar
        card={card}
        listId={listId}
        onAddCard={() => setShowAddModal(true)}
        onEditCard={(c) => { setCardToEdit(c); setShowEditModal(true) }}
      />

      {/* Question */}
      <h3 class="mb-8 text-center text-xl font-semibold text-neutral-900 md:text-2xl">{card.question}</h3>

      {/* Answer with blanks */}
      <div class="mb-8 text-center text-lg leading-relaxed text-neutral-700">{renderTextWithBlanks()}</div>

      {/* Submit or continue */}
      {isSubmitted ? (
        <div class="mt-6 text-center">
          <p class="mb-4 text-sm text-neutral-400">
            Press <kbd class="rounded-md bg-neutral-100 px-2 py-1 text-xs">Enter</kbd> or click to continue
          </p>
          <button onClick={(e) => { e.stopPropagation(); handleContinue() }} class="btn-primary">Continue</button>
        </div>
      ) : (
        <button onClick={handleSubmit} disabled={answers.some((a) => !a.trim())} class="btn-primary mt-6">
          Check Answers
        </button>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Card" size="lg">
        <AddCardModalContent
          listId={listId}
          onSuccess={() => { setShowAddModal(false); onCardUpdated?.() }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Card" size="lg">
        {cardToEdit && (
          <EditCardModalContent
            card={cardToEdit}
            onSuccess={() => { setShowEditModal(false); setCardToEdit(null); onCardUpdated?.() }}
            onCancel={() => { setShowEditModal(false); setCardToEdit(null) }}
          />
        )}
      </Modal>
    </div>
  )
}
