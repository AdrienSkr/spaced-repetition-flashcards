import { Icon } from '../shared/Icon'

interface StatsCardProps {
  iconName: 'book' | 'target' | 'clock' | 'folder' | 'chart' | 'trending-up'
  value: string | number
  label: string
  color?: 'primary' | 'success' | 'warning' | 'info'
}

export function StatsCard({ iconName, value, label, color = 'primary' }: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-brand-500',
    success: 'bg-success',
    warning: 'bg-warning',
    info: 'bg-brand-400',
  }

  return (
    <div class="card-elevated p-6 transition-shadow duration-fast hover:shadow-lg">
      <div class={`size-10 rounded-lg ${colorClasses[color]} mb-4 flex items-center justify-center`}>
        <Icon name={iconName} size={24} color="white" />
      </div>
      <div class="mb-1 text-2xl font-semibold text-neutral-900">{value}</div>
      <div class="text-sm text-neutral-500">{label}</div>
    </div>
  )
}
