import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, DollarSign, Activity } from "lucide-react"
import { getCryptoPrices } from "@/lib/crypto-prices"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const prices = await getCryptoPrices()

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

  return (
    <div>
      <DashboardHeader title="Overview" description="Your staking portfolio at a glance" />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ready to stake</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalStaked.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Earning rewards</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalRewards.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Stakes</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stakes?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Currently staking</p>
            </CardContent>
          </Card>
        </div>

        {/* Balances by Currency */}
        <Card>
          <CardHeader>
            <CardTitle>Your Balances</CardTitle>
          </CardHeader>
          <CardContent>
            {balances && balances.length > 0 ? (
              <div className="space-y-4">
                {balances.map((balance) => {
                  const price = prices[balance.currency.toLowerCase()] || 1
                  const availableAmount = Number.parseFloat(balance.available_balance.toString())
                  const stakedAmount = Number.parseFloat(balance.staked_balance.toString())
                  const rewardsAmount = Number.parseFloat(balance.total_rewards.toString())

                  return (
                    <div
                      key={balance.id}
                      className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-semibold">{balance.currency}</div>
                        <div className="text-sm text-muted-foreground">
                          Available: {availableAmount.toFixed(8)} (${(availableAmount * price).toFixed(2)})
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">
                          Staked: {stakedAmount.toFixed(8)} (${(stakedAmount * price).toFixed(2)})
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rewards: {rewardsAmount.toFixed(8)} (${(rewardsAmount * price).toFixed(2)})
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No balances yet. Start by making a deposit!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Stakes */}
        <Card>
          <CardHeader>
            <CardTitle>Active Stakes</CardTitle>
          </CardHeader>
          <CardContent>
            {stakes && stakes.length > 0 ? (
              <div className="space-y-4">
                {stakes.map((stake) => {
                  const price = prices[stake.currency.toLowerCase()] || 1
                  const stakeAmount = Number.parseFloat(stake.amount.toString())
                  const rewardsAmount = Number.parseFloat(stake.rewards_earned.toString())

                  return (
                    <div
                      key={stake.id}
                      className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-semibold">
                          {stake.currency} - {stakeAmount.toFixed(8)} (${(stakeAmount * price).toFixed(2)})
                        </div>
                        <div className="text-sm text-muted-foreground">
                          APY: {stake.apy}% | {stake.lockup_days === 0 ? "Flexible" : `${stake.lockup_days} days`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">
                          +{rewardsAmount.toFixed(8)} (${(rewardsAmount * price).toFixed(2)})
                        </div>
                        <div className="text-sm text-muted-foreground">Rewards earned</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active stakes. Start staking to earn rewards!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
