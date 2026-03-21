import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Layers3,
  Store,
  CircleHelp,
  MessageCircleMore,
  Users,
  Globe2,
  LogOut,
  SlidersVertical,
} from "lucide-react"

import { cn } from "@/lib/utils"

const mainNavItems = [
  {
    label: "Boshqaruv paneli",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Kategoriyalar",
    to: "/categories",
    icon: Layers3,
  },
  {
    label: "Do'konlar",
    to: "/shops",
    icon: Store,
  },
  {
    label: "Xarakteristikalar",
    to: "/characteristics",
    icon: SlidersVertical,
  },
]

const systemNavItems = [
  {
    label: "Tillar",
    to: "/languages",
    icon: Globe2,
  },
  {
    label: "Xabarlar",
    to: "/messages",
    icon: MessageCircleMore,
  },
  {
    label: "Xodimlar",
    to: "/staff",
    icon: Users,
  },
  {
    label: "Yordam",
    to: "/help",
    icon: CircleHelp,
  },
]

export function Sidebar() {

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar shadow-sm">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-tr from-orange-500 to-orange-400 text-sm font-semibold text-white shadow-md">
          M
        </div>
        <div>
          <div className="text-sm font-semibold leading-none">Minibaba</div>
          <div className="mt-0.5 text-xs text-muted-foreground">Super Admin</div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 px-3 py-4 text-sm">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Marketplace
          </p>
          <ul className="mt-2 space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.to}>
                <SidebarLink to={item.to} icon={item.icon}>
                  {item.label}
                </SidebarLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Tizim
          </p>
          <ul className="mt-2 space-y-1">
            {systemNavItems.map((item) => (
              <li key={item.to}>
                <SidebarLink to={item.to} icon={item.icon}>
                  {item.label}
                </SidebarLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="border-t px-3 pb-4 pt-3">
        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50">
          <LogOut className="h-4 w-4" />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  )
}

type SidebarLinkProps = {
  to: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  children: React.ReactNode
}

function SidebarLink({ to, icon: Icon, children }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
          isActive &&
            "bg-orange-500/10 text-orange-600 shadow-sm ring-1 ring-orange-200",
        )
      }
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </NavLink>
  )
}

