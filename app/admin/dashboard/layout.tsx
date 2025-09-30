import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminMobileHeader } from "@/components/admin-mobile-header"
import { requireAdmin } from "@/lib/admin-auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin()
  } catch {
    redirect("/admin/auth/login")
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <AdminMobileHeader />
      <aside className="w-64 hidden md:block">
        <AdminSidebar />
      </aside>
      <main className="flex-1 overflow-y-auto bg-background">{children}</main>
    </div>
  )
}
