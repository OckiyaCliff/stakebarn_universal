import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, DollarSign, Activity } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user balances
  const { data: balances } = await supabase.from("balances").select("*").eq("user_id", user!.id)

  // Fetch active stakes
  const { data: stakes } = await supabase.from("stakes").select("*").eq("user_id", user!.id).eq("status", "active")

  // Calculate totals
  const totalBalance =
    balances?.reduce((sum, b) => sum + Number.parseFloat(b.available_balance.toString()), 0).toFixed(4) || "0.0000"
  const totalStaked =
    balances?.reduce((sum, b) => sum + Number.parseFloat(b.staked_balance.toString()), 0).toFixed(4) || "0.0000"
  const totalRewards =
    balances?.reduce((sum, b) => sum + Number.parseFloat(b.total_rewards.toString()), 0).toFixed(4) || "0.0000"

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
              <div className="text-2xl font-bold">${totalBalance}</div>
              <p className="text-xs text-muted-foreground">Ready to stake</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalStaked}</div>
              <p className="text-xs text-muted-foreground">Earning rewards</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalRewards}</div>
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
                {balances.map((balance) => (
                  <div
                    key={balance.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-semibold">{balance.currency}</div>
                      <div className="text-sm text-muted-foreground">
                        Available: {Number.parseFloat(balance.available_balance.toString()).toFixed(8)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        Staked: {Number.parseFloat(balance.staked_balance.toString()).toFixed(8)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rewards: {Number.parseFloat(balance.total_rewards.toString()).toFixed(8)}
                      </div>
                    </div>
                  </div>
                ))}
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
                {stakes.map((stake) => (
                  <div
                    key={stake.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-semibold">
                        {stake.currency} - {Number.parseFloat(stake.amount.toString()).toFixed(8)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        APY: {stake.apy}% | {stake.lockup_days === 0 ? "Flexible" : `${stake.lockup_days} days`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        +{Number.parseFloat(stake.rewards_earned.toString()).toFixed(8)}
                      </div>
                      <div className="text-sm text-muted-foreground">Rewards earned</div>
                    </div>
                  </div>
                ))}
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
