import { useRef, useState } from 'react'
import { MoreVertical, Eye, Pencil, Ban, ArrowRight } from 'lucide-react'
import { useDashboardStore, type RecentStore, type StoreStatus} from '@/store/dashboardStore'

const STATUS_CONFIG: Record<StoreStatus, { label: string; dotColor: string; bg: string; text: string }> = {
  active: {
    label: 'Faol',
    dotColor: '#22C55E',
    bg: '#F0FDF4',
    text: '#16A34A',
  },
  pending: {
    label: 'Tekshirilmoqda',
    dotColor: '#EAB308',
    bg: '#FEFCE8',
    text: '#A16207',
  },
  blocked: {
    label: 'Bloklangan',
    dotColor: '#EF4444',
    bg: '#FFF1F2',
    text: '#DC2626',
  },
}

interface ActionMenuProps {
  store: RecentStore
  onClose: () => void
}

function ActionMenu({ store, onClose }: ActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const actions = [
    { label: "Ko'rish", icon: Eye, onClick: () => console.log('view', store.id) },
    { label: 'Tahrirlash', icon: Pencil, onClick: () => console.log('edit', store.id) },
    {
      label: store.status === 'blocked' ? 'Faollashtirish' : 'Bloklash',
      icon: Ban,
      onClick: () => console.log('block', store.id),
      danger: store.status !== 'blocked',
    },
  ]

  return (
    <div
      ref={menuRef}
      className="absolute right-8 top-0 z-20 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-1 overflow-hidden"
    >
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => {
            action.onClick()
            onClose()
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
            action.danger
              ? 'text-red-600 hover:bg-red-50'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <action.icon size={14} />
          {action.label}
        </button>
      ))}
    </div>
  )
}

interface StoreRowProps {
  store: RecentStore
  isLast: boolean
}

function StoreRow({ store, isLast }: StoreRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const status = STATUS_CONFIG[store.status]

  return (
    <tr className={`${!isLast ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-colors`}>
      {/* Store name */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ backgroundColor: store.avatarBg, color: store.avatarColor }}
          >
            {store.initial}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{store.name}</p>
            <p className="text-xs text-gray-400">ID: {store.id}</p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-3.5 px-4 text-sm text-gray-600 hidden sm:table-cell">
        {store.category}
      </td>

      {/* Status */}
      <td className="py-3.5 px-4">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: status.bg, color: status.text }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: status.dotColor }}
          />
          {status.label}
        </span>
      </td>

      {/* Date */}
      <td className="py-3.5 px-4 text-sm text-gray-500 hidden md:table-cell">
        {store.date}
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4">
        <div className="relative flex justify-end">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <ActionMenu store={store} onClose={() => setMenuOpen(false)} />
          )}
        </div>
      </td>
    </tr>
  )
}

export function RecentStores() {
  const { recentStores, isLoading } = useDashboardStore()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h2 className="text-base font-semibold text-gray-900">
          Yaqinda qo'shilgan do'konlar
        </h2>
        <a
          href="/stores"
          className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
        >
          Barchasini ko'rish
          <ArrowRight size={14} />
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Do'kon nomi
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">
                Kategoriya
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                Sana
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
                        <div>
                          <div className="w-24 h-3 bg-gray-100 rounded animate-pulse mb-1.5" />
                          <div className="w-16 h-2.5 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="w-20 h-3 bg-gray-100 rounded animate-pulse" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-20 h-5 bg-gray-100 rounded-full animate-pulse" />
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <div className="w-24 h-3 bg-gray-100 rounded animate-pulse" />
                    </td>
                    <td className="py-3.5 px-4" />
                  </tr>
                ))
              : recentStores.map((store, index) => (
                  <StoreRow
                    key={store.id}
                    store={store}
                    isLast={index === recentStores.length - 1}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}