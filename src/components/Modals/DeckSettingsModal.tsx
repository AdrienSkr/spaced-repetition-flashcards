import { useState } from 'preact/hooks'
import { db } from '../../models/db'
import { List, ToleranceLevel } from '../../models/List'
import { getToleranceDescription } from '../../utils/levenshtein'

interface DeckSettingsModalContentProps {
  list: List
  onSuccess: (updatedList: List) => void
  onCancel: () => void
}

export function DeckSettingsModalContent({
  list,
  onSuccess,
  onCancel,
}: DeckSettingsModalContentProps) {
  const [title, setTitle] = useState(list.title)
  const [toleranceLevel, setToleranceLevel] = useState<ToleranceLevel>(
    list.toleranceLevel || 'exact',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Please enter a deck name')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (list.id !== undefined) {
        await db.lists.update(list.id, {
          title: title.trim(),
          toleranceLevel,
        })
        onSuccess({
          ...list,
          title: title.trim(),
          toleranceLevel,
        })
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Failed to update deck:', error)
      setError('Failed to update deck. Please try again.')
      setIsSubmitting(false)
    }
  }

  const hasChanges =
    title !== list.title || toleranceLevel !== (list.toleranceLevel || 'exact')

  const toleranceOptions: ToleranceLevel[] = [
    'exact',
    'tolerant80',
    'tolerant60',
  ]

  const getToleranceLabel = (level: ToleranceLevel): string => {
    return getToleranceDescription(level).label
  }

  const getToleranceDesc = (level: ToleranceLevel): string => {
    return getToleranceDescription(level).description
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      {/* Deck Name */}
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">
          Deck Name
        </label>
        <input
          type="text"
          value={title}
          onInput={(e) => {
            setTitle(e.currentTarget.value)
            setError('')
          }}
          placeholder="Enter deck name"
          class="input"
        />
      </div>

      {/* Tolerance Level */}
      <div>
        <label class="mb-3 block text-sm font-medium text-gray-700">
          Answer Tolerance
        </label>
        <p class="mb-4 text-sm text-gray-500">
          How strict should the answer validation be for Typing and Fill-in
          modes?
        </p>
        <div class="space-y-2">
          {toleranceOptions.map((option) => (
            <label
              key={option}
              class={`flex cursor-pointer items-center rounded-xl border-2 p-4 transition-all duration-200 
                ${
                  toleranceLevel === option
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                }`}
            >
              <input
                type="radio"
                name="tolerance"
                value={option}
                checked={toleranceLevel === option}
                onChange={() => setToleranceLevel(option)}
                class="sr-only"
              />
              <div class="flex-1">
                <span class="font-medium text-gray-900">
                  {getToleranceLabel(option)}
                </span>
                <p class="mt-0.5 text-sm text-gray-500">
                  {getToleranceDesc(option)}
                </p>
              </div>
              {toleranceLevel === option && (
                <svg
                  class="size-5 text-primary-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              )}
            </label>
          ))}
        </div>
      </div>

      {error && <p class="text-sm text-error">{error}</p>}

      <div class="flex justify-end gap-3">
        <button type="button" onClick={onCancel} class="btn-ghost">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !hasChanges}
          class="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
