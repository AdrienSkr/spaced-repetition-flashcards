interface EmptyStateProps {
  onCreateList: () => void
}

export function EmptyState({ onCreateList }: EmptyStateProps) {
  return (
    <div class="flex animate-fade-in flex-col items-center justify-center py-8 text-center">
      {/* Compact Illustration */}
      <div class="mb-4">
        <div class="relative">
          <div class="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200">
            <svg class="size-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          {/* Decorative sparkle */}
          <div class="absolute -right-1 -top-1 size-4 text-primary-400">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Welcome text - compact */}
      <h2 class="mb-2 text-2xl font-bold text-gray-900">
        Welcome to <span class="text-gradient">PairWise Cards</span>!
      </h2>
      <p class="mb-6 max-w-sm text-gray-600">
        Create your first deck to start learning.
      </p>

      {/* CTA Button */}
      <button
        onClick={onCreateList}
        class="btn-primary flex items-center gap-2"
      >
        <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create My First Deck
      </button>

      {/* How it works - horizontal compact */}
      <div class="mt-8 flex flex-wrap justify-center gap-6 text-sm">
        <div class="flex items-center gap-2">
          <div class="flex size-8 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
            1
          </div>
          <span class="text-gray-600">Create a Deck</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex size-8 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
            2
          </div>
          <span class="text-gray-600">Add Cards</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex size-8 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
            3
          </div>
          <span class="text-gray-600">Learn Smart</span>
        </div>
      </div>
    </div>
  )
}
