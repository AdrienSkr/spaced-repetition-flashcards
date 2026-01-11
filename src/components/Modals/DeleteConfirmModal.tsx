import { useState } from 'preact/hooks'

interface DeleteConfirmModalContentProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export function DeleteConfirmModalContent({
  title,
  message,
  confirmLabel = 'Supprimer',
  onConfirm,
  onCancel,
}: DeleteConfirmModalContentProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
    } catch {
      setIsDeleting(false)
    }
  }

  return (
    <div class="space-y-6">
      <div class="flex items-start gap-4">
        <div class="icon-container-md shrink-0 rounded-lg bg-error-light">
          <svg
            class="size-6 text-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-neutral-900">{title}</h3>
          <p class="mt-2 text-neutral-600">{message}</p>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          class="btn-ghost"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isDeleting}
          class="btn-danger"
        >
          {isDeleting ? 'Suppression...' : confirmLabel}
        </button>
      </div>
    </div>
  )
}
