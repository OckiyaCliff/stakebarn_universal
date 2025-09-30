import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { WithdrawalRequestForm } from "@/components/withdrawal-request-form"
import { WithdrawalStatusCard } from "@/components/withdrawal-status-card"
import { getCryptoPrices } from "@/lib/crypto-prices"

export default async function WithdrawPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user balances
  const { data: balances } = await supabase
    .from("balances")
    .select("*")
    .eq("user_id", user!.id)
    .order("currency", { ascending: true })

  // Fetch recent withdrawals
  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get crypto prices for USD conversion
  const prices = await getCryptoPrices()

  return (
    <div>
      <DashboardHeader title="Withdraw" description="Request withdrawal of your funds" />

      <div className="p-6 space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Withdrawal requests are reviewed by our team. Processing time may vary depending on approval conditions.
            Make sure to enter a valid wallet address for the selected cryptocurrency.
          </AlertDescription>
        </Alert>

        <WithdrawalStatusCard />

        {/* Available Balances */}
        <Card>
          <CardHeader>
            <CardTitle>Available Balances</CardTitle>
            <CardDescription>Your current balances available for withdrawal</CardDescription>
          </CardHeader>
          <CardContent>
            {balances && balances.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {balances.map((balance) => {
                  const availableUSD = Number(balance.available_balance) * (prices[balance.currency.toLowerCase()] || 0)
                  const rewardsUSD = Number(balance.total_rewards) * (prices[balance.currency.toLowerCase()] || 0)

                  return (
                    <div key={balance.id} className="rounded-lg border border-border p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">{balance.currency}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available Balance:</span>
                          <div className="text-right">
                            <div className="font-medium">
                              {Number.parseFloat(balance.available_balance.toString()).toFixed(8)}
                            </div>
                            <div className="text-xs text-muted-foreground">${availableUSD.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Rewards:</span>
                          <div className="text-right">
                            <div className="font-medium">
                              {Number.parseFloat(balance.total_rewards.toString()).toFixed(8)}
                            </div>
                            <div className="text-xs text-muted-foreground">${rewardsUSD.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No balances available. Make a deposit to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal Request Form */}
        <WithdrawalRequestForm balances={balances || []} />

        {/* Recent Withdrawals */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>Your recent withdrawal requests</CardDescription>
          </CardHeader>
          <CardContent>
            {withdrawals && withdrawals.length > 0 ? (
              <div className="space-y-4">
                {withdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{withdrawal.currency}</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            withdrawal.status === "completed"
                              ? "bg-primary/10 text-primary"
                              : withdrawal.status === "approved"
                                ? "bg-blue-500/10 text-blue-500"
                                : withdrawal.status === "pending"
                                  ? "bg-yellow-500/10 text-yellow-500"
                                  : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {withdrawal.status}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">({withdrawal.withdrawal_type})</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(withdrawal.requested_at).toLocaleDateString()} at{" "}
                        {new Date(withdrawal.requested_at).toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        To: {withdrawal.wallet_address.slice(0, 16)}...
                      </div>
                      {withdrawal.admin_notes && (
                        <div className="text-xs text-muted-foreground italic">Note: {withdrawal.admin_notes}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{Number.parseFloat(withdrawal.amount.toString()).toFixed(8)}</div>
                      <div className="text-sm text-muted-foreground">{withdrawal.currency}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No withdrawal requests yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
