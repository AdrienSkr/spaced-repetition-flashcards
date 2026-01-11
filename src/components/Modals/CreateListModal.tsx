import { useState } from 'preact/hooks'
import { db } from '../../models/db'

interface CreateListModalContentProps {
  onSuccess: (listId: number) => void
  onCancel: () => void
}

export function CreateListModalContent({ onSuccess, onCancel }: CreateListModalContentProps) {
  const [title, setTitle] = useState('')
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
      const listId = await db.lists.add({ title: title.trim() })
      if (listId !== undefined) {
        onSuccess(listId)
      } else {
        throw new Error('Failed to get list ID')
      }
    } catch {
      setError('Failed to create deck. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      <div>
        <label class="label">Deck Name</label>
        <input
          type="text"
          value={title}
          onInput={(e) => {
            setTitle(e.currentTarget.value)
            setError('')
          }}
          placeholder="e.g., Japanese Vocabulary, History Facts..."
          class="input"
          autoFocus
        />
        {error && (
          <p class="mt-2 text-sm text-error">{error}</p>
        )}
      </div>

      <div class="flex justify-end gap-3">
        <button type="button" onClick={onCancel} class="btn-ghost">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          class="btn-primary"
        >
          {isSubmitting ? 'Creating...' : 'Create Deck'}
        </button>
      </div>
    </form>
  )
}
