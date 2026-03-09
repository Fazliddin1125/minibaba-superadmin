import { Bell, Moon, Search } from "lucide-react"

export function Navbar() {
  return (
    <header className="flex items-center justify-between border-b bg-card px-8 py-4">


     
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Qidiruv..."
            className="h-10 lg:w-124 rounded-sm border border-input bg-background pl-9 pr-4 text-sm shadow-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
          />
        </div>

       <div className="flex gap-2">
         <button className="flex h-9 w-9 items-center justify-center rounded-full border border-input bg-background text-muted-foreground shadow-sm hover:bg-muted">
          <Moon className="h-4 w-4" />
        </button>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-input bg-background text-muted-foreground shadow-sm hover:bg-muted">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 border-l pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
            AU
          </div>
          <div className="space-y-0.5 text-right">
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-muted-foreground">Super Admin</div>
          </div>
        </div>
       </div>
     
    </header>
  )
}

