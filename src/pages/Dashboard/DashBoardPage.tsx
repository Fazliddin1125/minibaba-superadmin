import { useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import { useDashboardStore } from '@/store/dashboardStore'
import { StatsGrid } from './ui/StatsGrid'
import { MarketplaceChart } from './ui/MarketPlaceChart'
import { RecentStores } from './ui/RecentStores'

function formatDate(date: Date): string {
  return date.toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function DashboardPage() {
  const { fetchDashboard } = useDashboardStore()
  const today = formatDate(new Date())

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return (
    <div className="min-h-screen bg-gray-50/60 overflow-y-auto grow ">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Boshqaruv Paneli
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Marketplace faoliyati haqida umumiy ma'lumot
            </p>
          </div>

          {/* Sana */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-100 rounded-xl shadow-sm text-sm text-gray-600 self-start">
            <CalendarDays size={15} className="text-gray-400" />
            <span>Bugun: {today}</span>
          </div>
        </div>

        {/* Stats cards */}
        <StatsGrid />

        {/* Chart */}
        <MarketplaceChart />

        {/* Recent stores */}
        <RecentStores />

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-2">
          © 2024 Minibaba. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  )
}