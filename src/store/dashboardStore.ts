import { create } from 'zustand'

export type StoreStatus = 'active' | 'pending' | 'blocked'
export type ChangeType = 'increase' | 'decrease'
export type ChartPeriod = 'Bu hafta' | 'Bu oy' | 'Bu yil'

export interface StatItem {
  id: string
  label: string
  value: string
  change: number
  changeType: ChangeType
  iconName: string
  iconBg: string
  iconColor: string
}

export interface RecentStore {
  id: string
  name: string
  initial: string
  avatarBg: string
  avatarColor: string
  category: string
  status: StoreStatus
  date: string
}

export interface ChartDataByPeriod {
  labels: string[]
  data: number[]
}

interface DashboardState {
  isLoading: boolean
  selectedPeriod: ChartPeriod
  stats: StatItem[]
  chartDataMap: Record<ChartPeriod, ChartDataByPeriod>
  recentStores: RecentStore[]
  fetchDashboard: () => Promise<void>
  setSelectedPeriod: (period: ChartPeriod) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isLoading: false,
  selectedPeriod: 'Bu hafta',

  stats: [
    {
      id: '1',
      label: "Jami do'konlar",
      value: '1,248',
      change: 12,
      changeType: 'increase',
      iconName: 'Store',
      iconBg: '#EFF6FF',
      iconColor: '#3B82F6',
    },
    {
      id: '2',
      label: 'Sotuvdagi mahsulotlar',
      value: '84,392',
      change: 5.4,
      changeType: 'increase',
      iconName: 'ClipboardList',
      iconBg: '#F5F3FF',
      iconColor: '#8B5CF6',
    },
    {
      id: '3',
      label: 'Oylik aylanma',
      value: '1.2B UZS',
      change: 24,
      changeType: 'increase',
      iconName: 'Wallet',
      iconBg: '#FFF7ED',
      iconColor: '#F97316',
    },
    {
      id: '4',
      label: 'Yangi foydalanuvchilar',
      value: '482',
      change: 2.1,
      changeType: 'decrease',
      iconName: 'UserPlus',
      iconBg: '#F5F3FF',
      iconColor: '#8B5CF6',
    },
  ],

  chartDataMap: {
    'Bu hafta': {
      labels: ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan', 'Yak'],
      data: [110, 175, 190, 152, 215, 248, 312],
    },
    'Bu oy': {
      labels: ['1-hafta', '2-hafta', '3-hafta', '4-hafta'],
      data: [820, 950, 1100, 1380],
    },
    'Bu yil': {
      labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
      data: [400, 520, 610, 730, 800, 870, 950, 880, 1020, 1150, 1080, 1300],
    },
  },

  recentStores: [
    {
      id: '#92831',
      name: 'TechnoMart',
      initial: 'T',
      avatarBg: '#FEE2E2',
      avatarColor: '#DC2626',
      category: 'Elektronika',
      status: 'active',
      date: '23 Okt, 2024',
    },
    {
      id: '#92832',
      name: 'Best Home',
      initial: 'B',
      avatarBg: '#DBEAFE',
      avatarColor: '#2563EB',
      category: 'Uy jihozlari',
      status: 'pending',
      date: '22 Okt, 2024',
    },
    {
      id: '#92833',
      name: 'Fashion Style',
      initial: 'F',
      avatarBg: '#FCE7F3',
      avatarColor: '#DB2777',
      category: 'Kiyim-kechak',
      status: 'active',
      date: '21 Okt, 2024',
    },
    {
      id: '#92834',
      name: 'Green Market',
      initial: 'G',
      avatarBg: '#DCFCE7',
      avatarColor: '#16A34A',
      category: 'Oziq-ovqat',
      status: 'blocked',
      date: '20 Okt, 2024',
    },
  ],

  fetchDashboard: async () => {
    set({ isLoading: true })
    await new Promise((resolve) => setTimeout(resolve, 500))
    set({ isLoading: false })
  },

  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
}))