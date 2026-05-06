import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"
import { ASSETS, STAKING_ASSETS, EARN_ASSETS, type Currency } from "@/lib/constants"
import { StakingPlanCard } from "@/components/staking-plan-card"
import { getCryptoPrices } from "@/lib/crypto-prices"

export default async function StakePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const prices = await getCryptoPrices()

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

  const renderCurrencyTabs = (currencies: string[], defaultTab: string, category: "staking" | "earn") => {
    return (
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="flex flex-wrap w-full h-auto p-1 gap-1 justify-start bg-muted/50">
          {currencies.map((currency) => (
            <TabsTrigger key={currency} value={currency} className="flex-1 min-w-[80px]">
              <span className="mr-1.5 opacity-70">{ASSETS[currency].icon}</span>
              {currency}
            </TabsTrigger>
          ))}
        </TabsList>

        {currencies.map((currency) => {
          const cryptoBalance = getBalance(currency)
          const price = prices[currency.toLowerCase()] || 1
          const usdValue = cryptoBalance * price
          const asset = ASSETS[currency]
          const isEarn = category === "earn"

          return (
            <TabsContent key={currency} value={currency} className="space-y-4 mt-4">
              {/* Balance Card */}
              <Card className={`border-${asset.borderColor}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm text-muted-foreground font-medium">Available Balance</CardTitle>
                      <CardDescription className="text-xs">Your available {asset.name} balance</CardDescription>
                    </div>
                    <div className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {asset.description}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold">
                      {cryptoBalance.toFixed(8)}
                    </div>
                    <div className="text-lg font-medium text-muted-foreground">{currency}</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">≈ ${usdValue.toFixed(2)} USD</div>
                  {cryptoBalance === 0 && (
                    <p className="mt-3 text-sm text-muted-foreground bg-muted/50 p-2.5 rounded-lg border border-border/50">
                      You need to deposit {currency} before you can {isEarn ? "earn yield" : "stake"}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Staking Plans */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {plansByCurrency?.[currency]?.map((plan) => (
                  <StakingPlanCard key={plan.id} plan={plan} availableBalance={cryptoBalance} userId={user!.id} isEarn={isEarn} />
                ))}
              </div>

              {(!plansByCurrency?.[currency] || plansByCurrency[currency].length === 0) && (
                <Card className="border-dashed border-border/50 bg-muted/20">
                  <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <span className="text-2xl">{asset.icon}</span>
                    </div>
                    <p>No {isEarn ? "yield" : "staking"} plans available for {currency} at the moment</p>
                    <p className="text-sm mt-1 opacity-70">Check back later for new opportunities</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    )
  }

  return (
    <div>
      <DashboardHeader title="Stake & Earn" description="Grow your crypto with staking and yield products" />

      <div className="p-6 space-y-6">
        <Tabs defaultValue="staking" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
            <TabsTrigger value="staking">Staking (PoS)</TabsTrigger>
            <TabsTrigger value="earn">Earn (Yield)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="staking" className="mt-0 outline-none">
            {renderCurrencyTabs(STAKING_ASSETS, "ETH", "staking")}
          </TabsContent>
          
          <TabsContent value="earn" className="mt-0 outline-none">
            {renderCurrencyTabs(EARN_ASSETS, "USDT", "earn")}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
