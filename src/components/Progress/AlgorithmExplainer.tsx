import { Icon } from '../shared/Icon'

export function AlgorithmExplainer() {
  return (
    <div class="animate-fade-in rounded-2xl bg-surface-card p-6 shadow-soft">
      <h3 class="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
        <Icon name="brain" size={28} color="#6b7280" />
        How Spaced Repetition Works
      </h3>

      <div class="space-y-4 text-gray-600">
        <p>
          Your brain naturally forgets information over time. <strong class="text-gray-900">Spaced repetition</strong> schedules 
          reviews just before you're about to forget, making memories stick permanently.
        </p>

        {/* Algorithm Explanation */}
        <div class="space-y-3">
          <h4 class="font-semibold text-gray-900">SM-2 Algorithm</h4>
          <p class="text-sm">
            We use the <strong>SuperMemo 2 (SM-2)</strong> algorithm, proven by decades of research.
            It calculates optimal review intervals based on:
          </p>
          
          <ul class="space-y-2 text-sm">
            <li class="flex items-start gap-2">
              <Icon name="check" size={18} color="#22c55e" class="mt-0.5 flex-shrink-0" />
              <span><strong>Correct answers</strong> increase the interval exponentially</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="cross" size={18} color="#ef4444" class="mt-0.5 flex-shrink-0" />
              <span><strong>Wrong answers</strong> reset the card to be reviewed soon</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="lightning" size={18} color="#8b5cf6" class="mt-0.5 flex-shrink-0" />
              <span><strong>Response speed</strong> fine-tunes difficulty rating</span>
            </li>
          </ul>
        </div>

        {/* What happens on wrong answer */}
        <div class="rounded-xl border-2 border-red-200 bg-red-50 p-4">
          <h4 class="mb-2 flex items-center gap-2 text-sm font-semibold text-red-800">
            <Icon name="cross" size={18} color="#dc2626" />
            What happens when you get it wrong?
          </h4>
          <p class="text-sm text-red-700">
            The card resets to <strong>Consolidating</strong> status (repetitions = 0) and is scheduled for review 
            <strong> tomorrow</strong> (interval = 1 day). This ensures you see difficult cards more often until they stick.
          </p>
        </div>

        {/* Status Transitions */}
        <div class="rounded-xl bg-gray-50 p-4">
          <h4 class="mb-3 text-sm font-semibold text-gray-900">Card Status Progression</h4>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-mastery-new px-3 py-1 text-xs font-medium text-gray-700">New</span>
              <span class="text-gray-400">→</span>
              <span class="text-gray-600">First correct answer</span>
              <span class="text-gray-400">→</span>
              <span class="rounded-full bg-mastery-learning px-3 py-1 text-xs font-medium text-gray-900">Consolidating</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-mastery-learning px-3 py-1 text-xs font-medium text-gray-900">Consolidating</span>
              <span class="text-gray-400">→</span>
              <span class="text-gray-600">3 correct in a row</span>
              <span class="text-gray-400">→</span>
              <span class="rounded-full bg-mastery-review px-3 py-1 text-xs font-medium text-white">Reviewing</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-mastery-review px-3 py-1 text-xs font-medium text-white">Reviewing</span>
              <span class="text-gray-400">→</span>
              <span class="text-gray-600">Interval reaches 21+ days</span>
              <span class="text-gray-400">→</span>
              <span class="rounded-full bg-mastery-mastered px-3 py-1 text-xs font-medium text-white">Mastered</span>
            </div>
          </div>
        </div>

        {/* Interval Schedule Example */}
        <div class="rounded-xl bg-gray-50 p-4">
          <h4 class="mb-3 text-sm font-semibold text-gray-900">Example Review Schedule (all correct)</h4>
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-mastery-new px-3 py-1.5 text-xs font-medium text-gray-700">
              New
            </span>
            <span class="text-gray-400">→</span>
            <span class="rounded-full bg-mastery-learning px-3 py-1.5 text-xs font-medium text-gray-900">
              1 day
            </span>
            <span class="text-gray-400">→</span>
            <span class="rounded-full bg-mastery-learning px-3 py-1.5 text-xs font-medium text-gray-900">
              6 days
            </span>
            <span class="text-gray-400">→</span>
            <span class="rounded-full bg-mastery-review px-3 py-1.5 text-xs font-medium text-white">
              15 days
            </span>
            <span class="text-gray-400">→</span>
            <span class="rounded-full bg-mastery-mastered px-3 py-1.5 text-xs font-medium text-white">
              1 month+
            </span>
          </div>
          <p class="mt-3 text-xs text-gray-500">
            Each correct answer multiplies the interval by the card's easiness factor (~2.5x).
            After 21 days between reviews, the card is considered mastered.
          </p>
        </div>
      </div>
    </div>
  )
}
