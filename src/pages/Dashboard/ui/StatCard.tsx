import type { StatItem } from '@/store/dashboardStore'
import {
  Store,
  ClipboardList,
  Wallet,
  UserPlus,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Store,
  ClipboardList,
  Wallet,
  UserPlus,
}

interface StatCardProps {
  stat: StatItem
  isLoading?: boolean
}

export function StatCard({ stat, isLoading }: StatCardProps) {
  const Icon = iconMap[stat.iconName]
  const isIncrease = stat.changeType === 'increase'

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-gray-100" />
          <div className="w-16 h-5 rounded-full bg-gray-100" />
        </div>
        <div className="w-24 h-3 rounded bg-gray-100 mb-2" />
        <div className="w-32 h-7 rounded bg-gray-100" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: stat.iconBg }}
        >
          {Icon && <Icon size={20} style={{ color: stat.iconColor }} />}
        </div>

        {/* O'sish yoki kamayishlar */}
        <div
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isIncrease
              ? 'text-emerald-600 bg-emerald-50'
              : 'text-red-500 bg-red-50'
          }`}
        >
          {isIncrease ? (
            <TrendingUp size={11} />
          ) : (
            <TrendingDown size={11} />
          )}
          <span>
            {isIncrease ? '+' : '-'}
            {stat.change}%
          </span>
        </div>
      </div>

      {/* Label */}
      <p className="text-sm text-gray-500 mb-1">{stat.label}</p>

      {/* Value */}
      <p className="text-2xl font-bold text-gray-900 tracking-tight">
        {stat.value}
      </p>
    </div>
  )
}