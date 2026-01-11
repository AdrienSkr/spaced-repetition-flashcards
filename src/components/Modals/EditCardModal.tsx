import { useState } from 'preact/hooks'
import { db } from '../../models/db'
import { Card } from '../../models/Card'

interface EditCardModalContentProps {
  card: Card
  onSuccess: () => void
  onCancel: () => void
}

export function EditCardModalContent({ card, onSuccess, onCancel }: EditCardModalContentProps) {
  const [question, setQuestion] = useState(card.question)
  const [answer, setAnswer] = useState(card.answer)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    
    if (!question.trim()) {
      setError('Please enter a question')
      return
    }
    if (!answer.trim()) {
      setError('Please enter an answer')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (card.id) {
        await db.cards.update(card.id, {
          question: question.trim(),
          answer: answer.trim(),
        })
      }
      onSuccess()
    } catch {
      setError('Failed to update card. Please try again.')
      setIsSubmitting(false)
    }
  }

  const hasChanges = question !== card.question || answer !== card.answer

  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      {/* Preview Card */}
      <div class="space-y-4 rounded-lg bg-brand-50 p-4">
        <div>
          <span class="text-xs font-medium uppercase tracking-wide text-brand-600">Question</span>
          <p class="mt-1 min-h-6 text-base text-neutral-900">
            {question || <span class="italic text-neutral-400">Your question will appear here...</span>}
          </p>
        </div>
        <div class="border-t border-brand-200 pt-4">
          <span class="text-xs font-medium uppercase tracking-wide text-brand-600">Answer</span>
          <p class="mt-1 min-h-6 text-base text-neutral-900">
            {answer || <span class="italic text-neutral-400">Your answer will appear here...</span>}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div class="space-y-4">
        <div>
          <label class="label">Question</label>
          <textarea
            value={question}
            onInput={(e) => {
              setQuestion(e.currentTarget.value)
              setError('')
            }}
            placeholder="What do you want to learn?"
            class="input min-h-[80px] resize-none"
            rows={2}
          />
        </div>

        <div>
          <label class="label">Answer</label>
          <textarea
            value={answer}
            onInput={(e) => {
              setAnswer(e.currentTarget.value)
              setError('')
            }}
            placeholder="What's the correct answer?"
            class="input min-h-[80px] resize-none"
            rows={2}
          />
        </div>
      </div>

      {error && (
        <p class="text-sm text-error">{error}</p>
      )}

      <div class="flex justify-end gap-3">
        <button type="button" onClick={onCancel} class="btn-ghost">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !hasChanges}
          class="btn-primary"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
