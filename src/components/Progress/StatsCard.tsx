import { Icon } from '../shared/Icon'

interface StatsCardProps {
  iconName:
    | 'book'
    | 'target'
    | 'clock'
    | 'folder'
    | 'chart'
    | 'trending-up'
  value: string | number
  label: string
  color?: 'primary' | 'success' | 'warning' | 'info'
}

export function StatsCard({
  iconName,
  value,
  label,
  color = 'primary',
}: StatsCardProps) {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-amber-500 to-amber-600',
    info: 'from-blue-500 to-blue-600',
  }

  return (
    <div class="rounded-2xl bg-surface-card p-6 shadow-soft transition-shadow hover:shadow-glow">
      <div
        class={`size-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} mb-4 flex items-center justify-center`}
      >
        <Icon name={iconName} size={28} color="white" />
      </div>
      <div class="mb-1 text-3xl font-bold text-gray-900">{value}</div>
      <div class="text-sm text-gray-500">{label}</div>
    </div>
  )
}
