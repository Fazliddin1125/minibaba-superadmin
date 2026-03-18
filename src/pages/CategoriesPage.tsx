import { useState } from "react"
import { ChevronDown, ChevronRight, Edit2, MoreHorizontal, Trash2 } from "lucide-react"

type Category = {
  id: number
  name: string
  description: string
  stats: string
  children?: { id: number; name: string }[]
}

const categories: Category[] = [
  {
    id: 1,
    name: "Elektronika",
    description: "16 ta sub-kategoriya",
    stats: "Telefonlar, kompyuterlar, maishiy texnika va boshqalar",
    children: [
      { id: 11, name: "Telefonlar" },
      { id: 12, name: "Kompyuterlar" },
      { id: 13, name: "Maishiy texnika" },
    ],
  },
  {
    id: 2,
    name: "Kiyim-kechak",
    description: "18 ta sub-kategoriya",
    stats: "Ayollar, erkaklar va bolalar kiyimlari",
  },
  {
    id: 3,
    name: "Uy va Ofis",
    description: "21 ta sub-kategoriya",
    stats: "Mebel, idish-tovoq, ofis jihozlari",
  },
  {
    id: 4,
    name: "Sport va Hobbi",
    description: "8 ta sub-kategoriya",
    stats: "Sport anjomlari va hobbi mahsulotlari",
  },
]

export function CategoriesPage() {
  const [selectedId, setSelectedId] = useState<number | null>(categories[0]?.id ?? null)
  const selected = categories.find((c) => c.id === selectedId) ?? categories[0]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Kategoriyalar</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Marketplace bo&apos;limlarini boshqaring. Kategoriyalar orqali mahsulotlarni
            tartibli va tez topiladigan qiling.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="search"
              placeholder="Kategoriyalarni qidiring..."
              className="h-10 w-60 rounded-full border border-input bg-background px-4 pr-9 text-sm shadow-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
            />
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-orange-500/95 hover:to-orange-400/95">
            + Yangi kategoriyani qo&apos;shish
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Chap tomon – katta ro'yxat */}
        <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm md:p-5">
          <p className="text-sm text-muted-foreground">
            Marketplace bo&apos;limlari bo&apos;yicha umumiy ro&apos;yxat.
          </p>

          <div className="space-y-2">
            {categories.map((category) => {
              const active = category.id === selected?.id

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedId(category.id)}
                  className={[
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition",
                    "hover:border-orange-200 hover:bg-orange-50/60",
                    active
                      ? "border-orange-300 bg-orange-50/80 shadow-sm"
                      : "border-border bg-background",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 text-sm font-semibold text-orange-600">
                      {category.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{category.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {category.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">{category.stats}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              )
            })}
          </div>

          <p className="mt-3 text-[11px] text-center text-muted-foreground">
            © 2024 Minibaba. Barcha huquqlar himoyalangan.
          </p>
        </div>

        {/* O'ng tomon – tanlangan kategoriya tafsilotlari */}
        <div className="hidden flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm md:flex md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">{selected?.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {selected?.description} &middot; {selected?.stats}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button className="inline-flex h-8 items-center gap-1 rounded-full border border-input bg-background px-3 text-xs font-medium hover:bg-muted">
                <Edit2 className="h-3.5 w-3.5" />
                Tahrirlash
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-input bg-background text-muted-foreground hover:bg-muted">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-input bg-background text-muted-foreground hover:bg-muted">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {selected?.children && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Sub-kategoriyalar</span>
                <button className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-medium text-orange-600 hover:bg-orange-100">
                  <ChevronDown className="h-3 w-3" />
                  Hammasini ochish
                </button>
              </div>

              <div className="space-y-1.5">
                {selected.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between rounded-lg border border-dashed border-border bg-background px-3 py-2 text-xs"
                  >
                    <span>{child.name}</span>
                    <button className="inline-flex items-center gap-1 rounded-full border border-input px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-muted">
                      <Edit2 className="h-3 w-3" />
                      Tahrirlash
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

