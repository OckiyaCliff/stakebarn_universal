import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardMobileDock } from "@/components/dashboard-mobile-dock"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RewardsUpdater } from "@/components/rewards-updater"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block">
        <DashboardSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">{children}</main>

      {/* Mobile Bottom Dock */}
      <DashboardMobileDock />

      {/* Rewards Updater */}
      <RewardsUpdater />
    </div>
  )
}
