import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wallet, TrendingUp, DollarSign } from "lucide-react"
import { fetchCryptoPrices, convertToUSD, formatUSD } from "@/lib/crypto-prices"
import { cn } from "@/lib/utils"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const prices = await fetchCryptoPrices()

  // Fetch statistics
  const [{ count: totalUsers }, { count: totalDeposits }, { count: activeStakes }, { data: deposits }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("deposits").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
      supabase.from("stakes").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("deposits").select("amount, currency").eq("status", "confirmed"),
    ])

  const volume =
    deposits?.reduce((sum, deposit) => {
      const usdValue = convertToUSD(Number(deposit.amount), deposit.currency, prices)
      return sum + usdValue
    }, 0) || 0

  const stats = [
    { name: "Total Users", value: totalUsers || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { name: "Total Deposits", value: totalDeposits || 0, icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { name: "Active Stakes", value: activeStakes || 0, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { name: "Total Volume", value: formatUSD(volume), icon: DollarSign, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Overview of StakeBarn platform</p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name} className={cn("border", stat.border, "bg-gradient-to-br from-card to-card/50")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", stat.bg)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
