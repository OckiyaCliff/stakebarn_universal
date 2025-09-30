import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PLATFORM_WALLETS, CURRENCY_INFO, type Currency } from "@/lib/constants"
import { AlertCircle } from "lucide-react"
import { WalletAddressCard } from "@/components/wallet-address-card"
import { createClient } from "@/lib/supabase/server"
import { DepositSubmissionForm } from "@/components/deposit-submission-form"

export default async function DepositPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch recent deposits
  const { data: deposits } = await supabase
    .from("deposits")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div>
      <DashboardHeader title="Deposit" description="Send crypto to your StakeBarn wallet" />

      <div className="p-6 space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Send only the selected cryptocurrency to the corresponding address. Sending other assets may result in
            permanent loss.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="ETH" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {(Object.keys(PLATFORM_WALLETS) as Currency[]).map((currency) => (
              <TabsTrigger key={currency} value={currency}>
                {currency}
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(PLATFORM_WALLETS) as Currency[]).map((currency) => (
            <TabsContent key={currency} value={currency} className="space-y-4">
              <WalletAddressCard currency={currency} address={PLATFORM_WALLETS[currency]} />

              <Card>
                <CardHeader>
                  <CardTitle>Deposit Instructions</CardTitle>
                  <CardDescription>Follow these steps to deposit {CURRENCY_INFO[currency].name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Copy the wallet address above</p>
                        <p className="text-sm text-muted-foreground">
                          Make sure you copy the complete address without any extra spaces
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Send {currency} from your wallet</p>
                        <p className="text-sm text-muted-foreground">
                          Use your preferred wallet or exchange to send {currency} to this address
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Submit your deposit details below</p>
                        <p className="text-sm text-muted-foreground">
                          Fill out the form below with your deposit information for faster verification
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        4
                      </div>
                      <div>
                        <p className="font-medium">Wait for admin approval</p>
                        <p className="text-sm text-muted-foreground">
                          Your deposit will be reviewed and approved by our team, then added to your balance
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <DepositSubmissionForm />

        {/* Recent Deposits */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deposits</CardTitle>
            <CardDescription>Your latest deposit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {deposits && deposits.length > 0 ? (
              <div className="space-y-4">
                {deposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{deposit.currency}</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            deposit.status === "confirmed"
                              ? "bg-primary/10 text-primary"
                              : deposit.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {deposit.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(deposit.created_at).toLocaleDateString()} at{" "}
                        {new Date(deposit.created_at).toLocaleTimeString()}
                      </div>
                      {deposit.tx_hash && (
                        <div className="text-xs text-muted-foreground font-mono">
                          TX: {deposit.tx_hash.slice(0, 16)}...
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{Number.parseFloat(deposit.amount.toString()).toFixed(8)}</div>
                      <div className="text-sm text-muted-foreground">{deposit.currency}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No deposits yet. Send crypto to one of the addresses above to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
