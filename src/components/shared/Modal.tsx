import { ComponentChildren } from 'preact'
import { render } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ComponentChildren
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Create portal container in body and render modal content
  useEffect(() => {
    if (!isOpen) {
      // Cleanup when closed
      if (containerRef.current && containerRef.current.parentNode) {
        render(null, containerRef.current)
        document.body.removeChild(containerRef.current)
        containerRef.current = null
      }
      document.body.style.overflow = ''
      return
    }

    // Create container if it doesn't exist
    if (!containerRef.current) {
      const container = document.createElement('div')
      container.id = 'modal-portal-container'
      document.body.appendChild(container)
      containerRef.current = container
    }

    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-2xl',
    }

    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    }

    const modalContent = (
      <div
        class="fixed inset-0 flex animate-fade-in items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          overflowY: 'auto',
        }}
      >
        <div
          class={`${sizeClasses[size]} w-full animate-bounce-in rounded-2xl bg-surface-card shadow-xl`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e: MouseEvent) => e.stopPropagation()}
          style={{
            position: 'relative',
            margin: 'auto',
            maxHeight: 'calc(100vh - 2rem)',
            overflow: 'auto',
          }}
        >
          {/* Header */}
          <div class="flex items-center justify-between border-b border-primary-100 px-6 py-4">
            <h2 id="modal-title" class="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close modal"
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
            </button>
          </div>

          {/* Content */}
          <div class="p-6">{children}</div>
        </div>
      </div>
    )

    if (containerRef.current) {
      render(modalContent, containerRef.current)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (containerRef.current && containerRef.current.parentNode) {
        render(null, containerRef.current)
        document.body.removeChild(containerRef.current)
        containerRef.current = null
      }
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, title, children, size])

  // This component doesn't render anything in its original location
  return null
}
