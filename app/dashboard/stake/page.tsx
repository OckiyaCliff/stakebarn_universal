import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import { CURRENCY_INFO, type Currency } from "@/lib/constants"
import { StakingPlanCard } from "@/components/staking-plan-card"

export default async function StakePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch all active staking plans
  const { data: stakingPlans } = await supabase.from("staking_plans").select("*").eq("is_active", true)

  // Fetch user balances
  const { data: balances } = await supabase.from("balances").select("*").eq("user_id", user!.id)

  // Group plans by currency
  const plansByCurrency = stakingPlans?.reduce(
    (acc, plan) => {
      if (!acc[plan.currency]) {
        acc[plan.currency] = []
      }
      acc[plan.currency].push(plan)
      return acc
    },
    {} as Record<string, typeof stakingPlans>,
  )

  // Get balance for each currency
  const getBalance = (currency: string) => {
    const balance = balances?.find((b) => b.currency === currency)
    return balance ? Number.parseFloat(balance.available_balance.toString()) : 0
  }

  const currencies = Object.keys(CURRENCY_INFO) as Currency[]

  return (
    <div>
      <DashboardHeader title="Stake" description="Choose a staking plan and start earning rewards" />

      <div className="p-6 space-y-6">
        <Tabs defaultValue="ETH" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {currencies.map((currency) => (
              <TabsTrigger key={currency} value={currency}>
                {currency}
              </TabsTrigger>
            ))}
          </TabsList>

          {currencies.map((currency) => (
            <TabsContent key={currency} value={currency} className="space-y-4">
              {/* Balance Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Balance</CardTitle>
                  <CardDescription>Your available {CURRENCY_INFO[currency].name} balance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {getBalance(currency).toFixed(8)} {currency}
                  </div>
                  {getBalance(currency) === 0 && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      You need to deposit {currency} before you can stake
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Staking Plans */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {plansByCurrency?.[currency]?.map((plan) => (
                  <StakingPlanCard
                    key={plan.id}
                    plan={plan}
                    availableBalance={getBalance(currency)}
                    userId={user!.id}
                  />
                ))}
              </div>

              {(!plansByCurrency?.[currency] || plansByCurrency[currency].length === 0) && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <p>No staking plans available for {currency} at the moment</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
