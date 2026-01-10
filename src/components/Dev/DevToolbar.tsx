import {
  isOnboardingTestMode,
  disableOnboardingTestMode,
} from '../../utils/devMode'
import { db } from '../../models/db'
import { Icon } from '../shared/Icon'

/**
 * DevToolbar - Only visible in development mode
 *
 * Shows current mode and provides quick toggles for testing
 */
export function DevToolbar() {
  if (!import.meta.env.DEV) return null

  const inOnboardingMode = isOnboardingTestMode()

  const handleExitOnboarding = async () => {
    disableOnboardingTestMode()
    // Clear DB and reload to get mock data
    await db.delete()
    window.location.reload()
  }

  const handleClearData = async () => {
    await db.lists.clear()
    await db.cards.clear()
    window.location.reload()
  }

  return (
    <div class="fixed bottom-24 right-4 z-50 flex flex-col gap-2 text-xs">
      {inOnboardingMode ? (
        <button
          onClick={handleExitOnboarding}
          class="flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-white shadow-lg transition-colors hover:bg-amber-600"
        >
          <Icon name="test-tube" size={18} color="white" />
          <span>Exit Onboarding Mode</span>
        </button>
      ) : (
        <a
          href="?onboarding"
          class="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-white no-underline shadow-lg transition-colors hover:bg-violet-700"
        >
          <Icon name="test-tube" size={18} color="white" />
          <span>Test Onboarding</span>
        </a>
      )}

      {inOnboardingMode && (
        <button
          onClick={handleClearData}
          class="flex items-center gap-2 rounded-lg bg-gray-600 px-3 py-2 text-white shadow-lg transition-colors hover:bg-gray-700"
        >
          <Icon name="trash" size={18} color="white" />
          <span>Clear Data</span>
        </button>
      )}

      <div
        class={`flex items-center justify-center gap-2 rounded px-2 py-1 text-center font-medium ${
          inOnboardingMode
            ? 'bg-amber-500 text-white'
            : 'bg-green-600 text-white'
        }`}
      >
        {inOnboardingMode ? (
          <>
            <Icon name="test-tube" size={16} color="white" />
            <span>Onboarding Mode</span>
          </>
        ) : (
          <>
            <Icon name="book" size={16} color="white" />
            <span>Dev Mode</span>
          </>
        )}
      </div>
    </div>
  )
}
