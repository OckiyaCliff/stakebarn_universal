'use client'

import { usePathname, useRouter } from 'next/navigation'
import Dock from '@/components/Dock'
import type { DockItemData } from '@/components/Dock'
import { LayoutDashboard, Users, Wallet, TrendingUp, DollarSign, ArrowDownToLine } from 'lucide-react'

export function AdminMobileDock() {
  const pathname = usePathname()
  const router = useRouter()

  const items: DockItemData[] = [
    {
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
      onClick: () => router.push('/admin/dashboard'),
      isActive: pathname === '/admin/dashboard',
    },
    {
      icon: <Users size={18} />,
      label: 'Users',
      onClick: () => router.push('/admin/dashboard/users'),
      isActive: pathname.startsWith('/admin/dashboard/users'),
    },
    {
      icon: <Wallet size={18} />,
      label: 'Deposits',
      onClick: () => router.push('/admin/dashboard/deposits'),
      isActive: pathname.startsWith('/admin/dashboard/deposits'),
    },
    {
      icon: <ArrowDownToLine size={18} />,
      label: 'Withdrawals',
      onClick: () => router.push('/admin/dashboard/withdrawals'),
      isActive: pathname.startsWith('/admin/dashboard/withdrawals'),
    },
    {
      icon: <TrendingUp size={18} />,
      label: 'Staking',
      onClick: () => router.push('/admin/dashboard/staking'),
      isActive: pathname.startsWith('/admin/dashboard/staking'),
    },
    {
      icon: <DollarSign size={18} />,
      label: 'Profits',
      onClick: () => router.push('/admin/dashboard/profits'),
      isActive: pathname.startsWith('/admin/dashboard/profits'),
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <Dock
        items={items}
        panelHeight={68}
        baseItemSize={42}
        magnification={58}
      />
    </div>
  )
}
