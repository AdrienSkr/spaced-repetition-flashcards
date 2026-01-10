import { useState } from 'preact/hooks'
import { db } from '../../models/db'
import { getDefaultSM2Data } from '../../utils/sm2'

interface AddCardModalContentProps {
  listId: number
  onSuccess: () => void
  onCancel: () => void
}

export function AddCardModalContent({ listId, onSuccess, onCancel }: AddCardModalContentProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
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
      await db.cards.add({
        question: question.trim(),
        answer: answer.trim(),
        listId,
        ...getDefaultSM2Data(),
      })
      onSuccess()
    } catch {
      setError('Failed to add card. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      {/* Preview Card */}
      <div class="space-y-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-6">
        <div>
          <span class="text-xs font-medium uppercase tracking-wide text-primary-500">Question</span>
          <p class="mt-1 min-h-7 text-lg text-gray-900">
            {question || <span class="italic text-gray-400">Your question will appear here...</span>}
          </p>
        </div>
        <div class="border-t border-primary-200 pt-4">
          <span class="text-xs font-medium uppercase tracking-wide text-primary-500">Answer</span>
          <p class="mt-1 min-h-7 text-lg text-gray-900">
            {answer || <span class="italic text-gray-400">Your answer will appear here...</span>}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Question
          </label>
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
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Answer
          </label>
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
        <button
          type="button"
          onClick={onCancel}
          class="btn-ghost"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          class="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Card'}
        </button>
      </div>
    </form>
  )
}
