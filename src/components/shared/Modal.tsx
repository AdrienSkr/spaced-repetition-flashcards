import { ComponentChildren } from 'preact'
import { createPortal } from 'preact/compat'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ComponentChildren
  size?: 'sm' | 'md' | 'lg'
}

// Sélecteur pour les éléments focusables
const FOCUSABLE_SELECTOR = 
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Create/remove portal container
  useEffect(() => {
    if (isOpen) {
      // Sauvegarder l'élément actif avant l'ouverture
      previousActiveElement.current = document.activeElement as HTMLElement

      const div = document.createElement('div')
      div.id = 'modal-portal-' + Math.random().toString(36).substr(2, 9)
      document.body.appendChild(div)
      setContainer(div)
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.removeChild(div)
        document.body.style.overflow = ''
        // Restaurer le focus à la fermeture
        if (previousActiveElement.current && previousActiveElement.current.focus) {
          previousActiveElement.current.focus()
        }
      }
    } else {
      setContainer(null)
    }
  }, [isOpen])

  // Focus sur le premier élément focusable à l'ouverture
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    // Petit délai pour s'assurer que le contenu est rendu
    const timeoutId = setTimeout(() => {
      if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        if (focusableElements.length > 0) {
          focusableElements[0].focus()
        } else {
          // Si aucun élément focusable, focus sur le conteneur
          modalRef.current.focus()
        }
      }
    }, 10)

    return () => clearTimeout(timeoutId)
  }, [isOpen, container])

  // Focus trap et gestion Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }

    if (e.key !== 'Tab' || !modalRef.current) return

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Shift + Tab sur le premier élément -> aller au dernier
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    }
    // Tab sur le dernier élément -> aller au premier
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  if (!isOpen || !container) return null

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
        ref={modalRef}
        class={`${sizeClasses[size]} w-full animate-bounce-in rounded-lg bg-surface-card shadow-lg focus:outline-none`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e: MouseEvent) => e.stopPropagation()}
        style={{
          position: 'relative',
          margin: 'auto',
          maxHeight: 'calc(100vh - 2rem)',
          overflow: 'auto',
        }}
      >
        {/* Header */}
        <div class="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 id="modal-title" class="text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            class="rounded-md p-2 text-neutral-400 transition-colors duration-fast hover:bg-neutral-100 hover:text-neutral-600"
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

  return createPortal(modalContent, container)
}
