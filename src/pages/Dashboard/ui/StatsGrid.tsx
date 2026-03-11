
import { useDashboardStore } from '@/store/dashboardStore'
import { StatCard } from './StatCard'

export function StatsGrid() {
  const { stats, isLoading } = useDashboardStore()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} isLoading={isLoading} />
      ))}
    </div>
  )
}