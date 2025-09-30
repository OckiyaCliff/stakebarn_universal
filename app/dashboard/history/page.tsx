import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { getCryptoPrices } from "@/lib/crypto-prices"

export default async function HistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const prices = await getCryptoPrices()

  // Fetch all deposits
  const { data: deposits } = await supabase
    .from("deposits")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  // Fetch all stakes
  const { data: stakes } = await supabase
    .from("stakes")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  return (
    <div>
      <DashboardHeader title="History" description="View your transaction and staking history" />

      <div className="p-6">
        <Tabs defaultValue="stakes" className="w-full">
          <TabsList>
            <TabsTrigger value="stakes">Stakes</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
          </TabsList>

          <TabsContent value="stakes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Staking History</CardTitle>
                <CardDescription>All your staking activities</CardDescription>
              </CardHeader>
              <CardContent>
                {stakes && stakes.length > 0 ? (
                  <div className="space-y-4">
                    {stakes.map((stake) => {
                      const startDate = new Date(stake.start_date)
                      const endDate = stake.end_date ? new Date(stake.end_date) : null
                      const now = new Date()
                      const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

                      const price = prices[stake.currency.toLowerCase()] || 1
                      const stakeAmount = Number.parseFloat(stake.amount.toString())
                      const rewardsAmount = Number.parseFloat(stake.rewards_earned.toString())

                      return (
                        <div key={stake.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-lg">
                                  {stakeAmount.toFixed(8)} {stake.currency}
                                </span>
                                <Badge
                                  variant={
                                    stake.status === "active"
                                      ? "default"
                                      : stake.status === "completed"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {stake.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ≈ ${(stakeAmount * price).toFixed(2)} USD
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Started {startDate.toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">{stake.apy}%</div>
                              <div className="text-xs text-muted-foreground">APY</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                            <div>
                              <div className="text-xs text-muted-foreground">Lock Period</div>
                              <div className="text-sm font-medium">
                                {stake.lockup_days === 0 ? "Flexible" : `${stake.lockup_days} days`}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Days Elapsed</div>
                              <div className="text-sm font-medium">{daysElapsed} days</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Rewards Earned</div>
                              <div className="text-sm font-semibold text-primary">
                                {rewardsAmount.toFixed(8)} {stake.currency}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ≈ ${(rewardsAmount * price).toFixed(2)} USD
                              </div>
                            </div>
                            {endDate && (
                              <div>
                                <div className="text-xs text-muted-foreground">Unlock Date</div>
                                <div className="text-sm font-medium">{endDate.toLocaleDateString()}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No staking history yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Deposit History</CardTitle>
                <CardDescription>All your deposit transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {deposits && deposits.length > 0 ? (
                  <div className="space-y-4">
                    {deposits.map((deposit) => {
                      const price = prices[deposit.currency.toLowerCase()] || 1
                      const depositAmount = Number.parseFloat(deposit.amount.toString())

                      return (
                        <div
                          key={deposit.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{deposit.currency}</span>
                              <Badge
                                variant={
                                  deposit.status === "confirmed"
                                    ? "default"
                                    : deposit.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {deposit.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(deposit.created_at).toLocaleDateString()} at{" "}
                              {new Date(deposit.created_at).toLocaleTimeString()}
                            </div>
                            {deposit.tx_hash && (
                              <div className="text-xs text-muted-foreground font-mono">
                                TX: {deposit.tx_hash.slice(0, 32)}...
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">{depositAmount.toFixed(8)}</div>
                            <div className="text-sm text-muted-foreground">{deposit.currency}</div>
                            <div className="text-sm text-muted-foreground">
                              ≈ ${(depositAmount * price).toFixed(2)} USD
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No deposit history yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
