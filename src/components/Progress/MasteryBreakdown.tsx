import { getMasteryLabel, getMasteryDescription, MasteryLevel } from '../../utils/sm2'
import { Icon } from '../shared/Icon'

interface MasteryBreakdownProps {
  counts: Record<MasteryLevel, number>
  total: number
  dueNowCount: number
}

export function MasteryBreakdown({ counts, total, dueNowCount }: MasteryBreakdownProps) {
  const levels: { level: MasteryLevel; color: string; description: string }[] = [
    { level: 'new', color: '#e7e5e4', description: getMasteryDescription('new') },
    { level: 'learning', color: '#fbbf24', description: getMasteryDescription('learning') },
    { level: 'review', color: '#38bdf8', description: getMasteryDescription('review') },
    { level: 'mastered', color: '#22c55e', description: getMasteryDescription('mastered') },
  ]

  if (total === 0) {
    return (
      <div class="card-elevated p-6">
        <h3 class="section-title mb-4 flex items-center gap-2">
          <Icon name="chart" size={24} color="#78716c" />
          Cards by Status
        </h3>
        <p class="text-sm text-neutral-500">No cards yet. Create some to start tracking!</p>
      </div>
    )
  }

  return (
    <div class="card-elevated p-6">
      <h3 class="section-title mb-4 flex items-center gap-2">
        <Icon name="chart" size={24} color="#78716c" />
        Cards by Status
      </h3>

      {/* Due Now - Special highlight */}
      <div class="mb-4 rounded-lg bg-warning-light p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="clock" size={20} color="#b45309" />
            <span class="font-medium text-warning-dark">Due Now</span>
          </div>
          <span class="text-xl font-semibold text-warning-dark">{dueNowCount}</span>
        </div>
        <p class="mt-1 text-xs text-warning-dark/70">Cards ready for review right now</p>
      </div>

      <div class="space-y-3">
        {levels.map(({ level, color, description }) => {
          const count = counts[level] || 0
          const percentage = total > 0 ? (count / total) * 100 : 0

          return (
            <div key={level} class="flex items-center gap-3">
              <Icon name="circle" size={20} color={color} />
              <div class="flex-1">
                <div class="mb-1 flex justify-between text-sm">
                  <div class="flex flex-col">
                    <span class="text-neutral-700">{getMasteryLabel(level)}</span>
                    <span class="text-xs text-neutral-400">{description}</span>
                  </div>
                  <span class="text-neutral-500">{count}</span>
                </div>
                <div class="h-2 overflow-hidden rounded-md bg-neutral-100">
                  <div
                    class={`h-full rounded-md transition-all duration-normal ${
                      level === 'new' ? 'bg-mastery-new' :
                      level === 'learning' ? 'bg-mastery-learning' :
                      level === 'review' ? 'bg-mastery-review' : 'bg-mastery-mastered'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Overall Mastery Progress */}
      <div class="mt-6 border-t border-neutral-100 pt-4">
        <div class="mb-2 flex justify-between text-sm">
          <span class="font-medium text-neutral-700">Overall Mastery</span>
          <span class="font-semibold text-brand-600">
            {total > 0 ? Math.round((counts.mastered / total) * 100) : 0}%
          </span>
        </div>
        <div class="h-3 overflow-hidden rounded-md bg-neutral-100">
          <div
            class="h-full rounded-md bg-brand-500 transition-all duration-normal"
            style={{ width: `${total > 0 ? (counts.mastered / total) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}
