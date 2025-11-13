"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Shield, Users, Wallet, TrendingUp, LayoutDashboard, LogOut, ArrowDownToLine, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/dashboard/users", icon: Users },
  { name: "Deposit Management", href: "/admin/dashboard/deposits", icon: Wallet },
  { name: "Withdrawal Management", href: "/admin/dashboard/withdrawals", icon: ArrowDownToLine },
  { name: "Staking Management", href: "/admin/dashboard/staking", icon: TrendingUp },
  { name: "Profits Management", href: "/admin/dashboard/profits", icon: DollarSign },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/auth/login")
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col bg-card border-r">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Shield className="h-6 w-6 text-emerald-500" />
        <span className="text-lg font-bold">Admin Panel</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
