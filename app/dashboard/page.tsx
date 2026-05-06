import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowDownToLine,
  ArrowLeftRight,
  Gift,
  ArrowUpRight,
} from "lucide-react"
import { getCryptoPrices } from "@/lib/crypto-prices"

const currencyColors: Record<string, string> = {
  ETH: "from-blue-500/15 to-blue-500/5 border-blue-500/20",
  BTC: "from-orange-500/15 to-orange-500/5 border-orange-500/20",
  SOL: "from-purple-500/15 to-purple-500/5 border-purple-500/20",
  XRP: "from-gray-400/15 to-gray-400/5 border-gray-400/20",
}

const currencyIcons: Record<string, string> = {
  ETH: "Ξ",
  BTC: "₿",
  SOL: "◎",
  XRP: "✕",
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const prices = await getCryptoPrices()

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, bonus_claimed")
    .eq("id", user!.id)
    .single()

  // Fetch user balances
  const { data: balances } = await supabase.from("balances").select("*").eq("user_id", user!.id)

  const totalBalance =
    balances?.reduce((sum, b) => {
      const amount = Number.parseFloat(b.available_balance.toString())
      const price = prices[b.currency.toLowerCase()] || 1
      return sum + amount * price
    }, 0) || 0

  const totalStaked =
    balances?.reduce((sum, b) => {
      const amount = Number.parseFloat(b.staked_balance.toString())
      const price = prices[b.currency.toLowerCase()] || 1
      return sum + amount * price
    }, 0) || 0

  const totalRewards =
    balances?.reduce((sum, b) => {
      const amount = Number.parseFloat(b.total_rewards.toString())
      const price = prices[b.currency.toLowerCase()] || 1
      return sum + amount * price
    }, 0) || 0

  // Fetch active stakes
  const { data: stakes } = await supabase.from("stakes").select("*").eq("user_id", user!.id).eq("status", "active")

  const displayName = profile?.email?.split("@")[0] || "User"

  return (
    <div>
      <DashboardHeader title="Overview" description="Your staking portfolio at a glance" />

      <div className="p-6 space-y-6">
        {/* Welcome & Total Balance */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Welcome back</p>
            <h2 className="text-lg font-semibold text-foreground">Hey, {displayName} 👋</h2>
          </div>
          {profile?.bonus_claimed && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
              <Gift className="h-3 w-3" />
              $15 Bonus Active
            </div>
          )}
        </div>

        {/* Main Balance Card */}
        <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
            <div className="text-4xl sm:text-5xl font-bold text-foreground mt-1">
              ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div>
                <span className="text-muted-foreground">Staked: </span>
                <span className="font-semibold text-primary">${totalStaked.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Rewards: </span>
                <span className="font-semibold text-emerald-400">${totalRewards.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Wallet, label: "Deposit", href: "/dashboard/deposit", color: "bg-blue-500/10 text-blue-400" },
            { icon: ArrowDownToLine, label: "Withdraw", href: "/dashboard/withdraw", color: "bg-emerald-500/10 text-emerald-400" },
            { icon: ArrowLeftRight, label: "Swap", href: "/dashboard/swap", color: "bg-purple-500/10 text-purple-400" },
            { icon: TrendingUp, label: "Stake", href: "/dashboard/stake", color: "bg-orange-500/10 text-orange-400" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-border/30 bg-card/50 p-4 hover:bg-card/80 transition-colors group"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Currency Balance Cards */}
        {balances && balances.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {balances.map((balance) => {
              const price = prices[balance.currency.toLowerCase()] || 1
              const availableAmount = Number.parseFloat(balance.available_balance.toString())
              const stakedAmount = Number.parseFloat(balance.staked_balance.toString())
              const rewardsAmount = Number.parseFloat(balance.total_rewards.toString())
              const totalUsd = (availableAmount + stakedAmount) * price
              const colorClass = currencyColors[balance.currency] || "from-gray-500/15 to-gray-500/5 border-gray-500/20"
              const icon = currencyIcons[balance.currency] || "○"

              return (
                <Card key={balance.id} className={`bg-gradient-to-br ${colorClass} border`}>
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">{icon}</span>
                        <span className="font-semibold">{balance.currency}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">${totalUsd.toFixed(2)}</span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available</span>
                        <span className="font-medium">{availableAmount.toFixed(8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Staked</span>
                        <span className="font-medium text-primary">{stakedAmount.toFixed(8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rewards</span>
                        <span className="font-medium text-emerald-400">+{rewardsAmount.toFixed(8)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {(!balances || balances.length === 0) && (
          <Card className="border-dashed border-border/50">
            <CardContent className="py-12 text-center">
              <Wallet className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No balances yet. Start by making a deposit!</p>
              <Button asChild size="sm" className="rounded-full">
                <Link href="/dashboard/deposit">
                  Make First Deposit <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Active Stakes */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Active Stakes</CardTitle>
              <span className="text-xs text-muted-foreground">{stakes?.length || 0} active</span>
            </div>
          </CardHeader>
          <CardContent>
            {stakes && stakes.length > 0 ? (
              <div className="space-y-3">
                {stakes.map((stake) => {
                  const price = prices[stake.currency.toLowerCase()] || 1
                  const stakeAmount = Number.parseFloat(stake.amount.toString())
                  const rewardsAmount = Number.parseFloat(stake.rewards_earned.toString())

                  return (
                    <div
                      key={stake.id}
                      className="flex items-center justify-between rounded-xl border border-border/30 bg-card/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {currencyIcons[stake.currency] || "○"}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {stakeAmount.toFixed(6)} {stake.currency}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stake.apy}% APY · {stake.lockup_days === 0 ? "Flexible" : `${stake.lockup_days}d`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-emerald-400">
                          +{rewardsAmount.toFixed(6)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${(rewardsAmount * price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Activity className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No active stakes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
