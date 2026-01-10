import { getMasteryLabel, getMasteryDescription, MasteryLevel } from '../../utils/sm2'
import { Icon } from '../shared/Icon'

interface MasteryBreakdownProps {
  counts: Record<MasteryLevel, number>
  total: number
  dueNowCount: number
}

export function MasteryBreakdown({ counts, total, dueNowCount }: MasteryBreakdownProps) {
  const levels: { level: MasteryLevel; color: string; description: string }[] = [
    { level: 'new', color: '#e5e7eb', description: getMasteryDescription('new') },
    { level: 'learning', color: '#fbbf24', description: getMasteryDescription('learning') },
    { level: 'review', color: '#60a5fa', description: getMasteryDescription('review') },
    { level: 'mastered', color: '#34d399', description: getMasteryDescription('mastered') },
  ]

  if (total === 0) {
    return (
      <div class="rounded-2xl bg-surface-card p-6 shadow-soft">
        <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Icon name="chart" size={24} color="#6b7280" />
          Cards by Status
        </h3>
        <p class="text-sm text-gray-500">
          No cards yet. Create some to start tracking!
        </p>
      </div>
    )
  }

  return (
    <div class="rounded-2xl bg-surface-card p-6 shadow-soft">
      <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <Icon name="chart" size={24} color="#6b7280" />
        Cards by Status
      </h3>

      {/* Due Now - Special highlight */}
      <div class="mb-4 rounded-xl bg-red-50 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="clock" size={20} color="#dc2626" />
            <span class="font-medium text-red-700">Due Now</span>
          </div>
          <span class="text-2xl font-bold text-red-600">{dueNowCount}</span>
        </div>
        <p class="mt-1 text-xs text-red-600/70">Cards ready for review right now</p>
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
                    <span class="text-gray-700">{getMasteryLabel(level)}</span>
                    <span class="text-xs text-gray-400">{description}</span>
                  </div>
                  <span class="text-gray-500">{count}</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    class={`h-full rounded-full transition-all duration-500 ${
                      level === 'new'
                        ? 'bg-mastery-new'
                        : level === 'learning'
                        ? 'bg-mastery-learning'
                        : level === 'review'
                        ? 'bg-mastery-review'
                        : 'bg-mastery-mastered'
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
      <div class="mt-6 border-t border-gray-100 pt-4">
        <div class="mb-2 flex justify-between text-sm">
          <span class="font-medium text-gray-700">Overall Mastery</span>
          <span class="font-semibold text-primary-600">
            {total > 0 ? Math.round((counts.mastered / total) * 100) : 0}%
          </span>
        </div>
        <div class="h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            class="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
            style={{
              width: `${total > 0 ? (counts.mastered / total) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
