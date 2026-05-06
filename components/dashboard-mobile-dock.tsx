'use client'

import { usePathname, useRouter } from 'next/navigation'
import Dock from '@/components/Dock'
import type { DockItemData } from '@/components/Dock'
import { LayoutDashboard, Wallet, ArrowLeftRight, ArrowDownToLine, TrendingUp } from 'lucide-react'

export function DashboardMobileDock() {
  const pathname = usePathname()
  const router = useRouter()

  const items: DockItemData[] = [
    {
      icon: <LayoutDashboard size={18} />,
      label: 'Overview',
      onClick: () => router.push('/dashboard'),
      isActive: pathname === '/dashboard',
    },
    {
      icon: <Wallet size={18} />,
      label: 'Deposit',
      onClick: () => router.push('/dashboard/deposit'),
      isActive: pathname === '/dashboard/deposit',
    },
    {
      icon: <ArrowLeftRight size={18} />,
      label: 'Swap',
      onClick: () => router.push('/dashboard/swap'),
      isActive: pathname === '/dashboard/swap',
    },
    {
      icon: <ArrowDownToLine size={18} />,
      label: 'Withdraw',
      onClick: () => router.push('/dashboard/withdraw'),
      isActive: pathname === '/dashboard/withdraw',
    },
    {
      icon: <TrendingUp size={18} />,
      label: 'Stake',
      onClick: () => router.push('/dashboard/stake'),
      isActive: pathname === '/dashboard/stake',
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <Dock
        items={items}
        panelHeight={68}
        baseItemSize={46}
        magnification={64}
      />
    </div>
  )
}
