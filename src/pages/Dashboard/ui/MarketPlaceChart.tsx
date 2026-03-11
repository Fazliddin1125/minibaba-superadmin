import { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { ChevronDown } from 'lucide-react'
import { useDashboardStore } from '@/store/dashboardStore'
import type { ChartPeriod } from '@/store/dashboardStore'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const PERIODS: ChartPeriod[] = ['Bu hafta', 'Bu oy', 'Bu yil']
const ORANGE = '#F97316'
const ORANGE_LIGHT = 'rgba(249, 115, 22, 0.12)'

export function MarketplaceChart() {
  const { chartDataMap, selectedPeriod, setSelectedPeriod, isLoading } = useDashboardStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentData = chartDataMap[selectedPeriod]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const data: ChartData<'line'> = {
    labels: currentData.labels,
    datasets: [
      {
        data: currentData.data,
        borderColor: ORANGE,
        borderWidth: 2.5,
        backgroundColor: ORANGE_LIGHT,
        fill: true,
        tension: 0.45,
        pointBackgroundColor: '#fff',
        pointBorderColor: ORANGE,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: ORANGE,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#9CA3AF',
        bodyColor: '#F9FAFB',
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (items) => items[0]?.label ?? '',
          label: (item) => `${item.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#9CA3AF',
          font: { size: 12 },
        },
      },
      y: {
        border: { display: false, dash: [4, 4] },
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#9CA3AF',
          font: { size: 12 },
          maxTicksLimit: 6,
        },
        min: 0,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-900">
          Marketplace Umumiy Statistikasi
        </h2>

        {/* Period dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {selectedPeriod}
            <ChevronDown
              size={14}
              className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1 overflow-hidden">
              {PERIODS.map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period)
                    setDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    period === selectedPeriod
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-56 sm:h-64">
        {isLoading ? (
          <div className="w-full h-full rounded-xl bg-gray-50 animate-pulse" />
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  )
}