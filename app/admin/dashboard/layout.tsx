import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminMobileDock } from "@/components/admin-mobile-dock"
import { requireAdmin } from "@/lib/admin-auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin()
  } catch {
    redirect("/admin/auth/login")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 hidden md:block">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background pb-24 md:pb-0">{children}</main>

      {/* Mobile Bottom Dock */}
      <AdminMobileDock />
    </div>
  )
}
