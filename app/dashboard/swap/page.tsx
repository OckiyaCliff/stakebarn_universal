"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownUp, Loader2, Info, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { SWAP_FEE_PERCENT, ALL_CURRENCIES } from "@/lib/constants"

interface Balance {
  currency: string
  available_balance: number
}

export default function SwapPage() {
  const router = useRouter()
  const [balances, setBalances] = useState<Balance[]>([])
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [fromCurrency, setFromCurrency] = useState("")
  const [toCurrency, setToCurrency] = useState("")
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data: balanceData } = await supabase
          .from("balances")
          .select("currency, available_balance")
          .eq("user_id", user.id)
          .order("currency")

        setBalances(balanceData || [])

        // Fetch prices
        const priceRes = await fetch("/api/crypto-prices")
        if (priceRes.ok) {
          const priceData = await priceRes.json()
          setPrices(priceData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const fromBalance = balances.find((b) => b.currency === fromCurrency)
  const maxAmount = fromBalance ? parseFloat(fromBalance.available_balance.toString()) : 0

  const amountNum = parseFloat(amount) || 0
  const fromPrice = prices[fromCurrency?.toLowerCase()] || 0
  const toPrice = prices[toCurrency?.toLowerCase()] || 0

  const usdValue = amountNum * fromPrice
  const fee = usdValue * SWAP_FEE_PERCENT
  const netUsdValue = usdValue - fee
  const receivedAmount = toPrice > 0 ? netUsdValue / toPrice : 0
  const exchangeRate = fromPrice > 0 && toPrice > 0 ? fromPrice / toPrice : 0

  const handleSwapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
    setAmount("")
  }

  const handleSubmit = async () => {
    if (!fromCurrency || !toCurrency || !amount) {
      toast.error("Please fill in all fields")
      return
    }

    if (amountNum <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    if (amountNum > maxAmount) {
      toast.error("Insufficient balance")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromCurrency, toCurrency, amount: amountNum }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Swap failed")
        return
      }

      toast.success(
        `Swapped ${data.swap.amountSent.toFixed(8)} ${fromCurrency} → ${data.swap.amountReceived.toFixed(8)} ${toCurrency}`
      )

      setAmount("")
      router.refresh()

      // Refresh balances
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: newBalances } = await supabase
          .from("balances")
          .select("currency, available_balance")
          .eq("user_id", user.id)
          .order("currency")
        setBalances(newBalances || [])
      }
    } catch {
      toast.error("Failed to execute swap")
    } finally {
      setIsSubmitting(false)
    }
  }

  const currencies = ALL_CURRENCIES

  if (isLoading) {
    return (
      <div>
        <DashboardHeader title="Swap" description="Exchange between cryptocurrencies" />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <DashboardHeader title="Swap" description="Exchange between cryptocurrencies" />

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Swap Card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownUp className="h-5 w-5 text-primary" />
              Token Swap
            </CardTitle>
            <CardDescription>
              Swap between your crypto balances at live market rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From */}
            <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">You send</Label>
                {fromCurrency && (
                  <span className="text-xs text-muted-foreground">
                    Balance: {maxAmount.toFixed(8)} {fromCurrency}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  step="0.00000001"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl font-bold border-0 bg-transparent p-0 h-auto focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Select value={fromCurrency} onValueChange={(v) => { setFromCurrency(v); setAmount(""); }}>
                  <SelectTrigger className="w-32 rounded-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.filter((c) => c !== toCurrency).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {fromCurrency && (
                <div className="flex gap-2">
                  {[0.25, 0.5, 0.75, 1].map((pct) => (
                    <Button
                      key={pct}
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-full h-7 px-3 bg-transparent border-border/40"
                      onClick={() => setAmount((maxAmount * pct).toFixed(8))}
                    >
                      {pct === 1 ? "Max" : `${pct * 100}%`}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-border/50 bg-card hover:bg-primary/10"
                onClick={handleSwapCurrencies}
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            {/* To */}
            <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-3">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">You receive</Label>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold flex-1 min-h-[2rem]">
                  {receivedAmount > 0 ? receivedAmount.toFixed(8) : "0.00"}
                </div>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-32 rounded-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.filter((c) => c !== fromCurrency).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rate & Fee Breakdown */}
            {fromCurrency && toCurrency && amountNum > 0 && (
              <div className="rounded-xl border border-border/30 bg-card/50 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Exchange Rate</span>
                  <span>1 {fromCurrency} = {exchangeRate.toFixed(8)} {toCurrency}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Value</span>
                  <span>${usdValue.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    Swap Fee ({SWAP_FEE_PERCENT * 100}%)
                    <Info className="h-3 w-3" />
                  </span>
                  <span className="text-yellow-500">-${fee.toFixed(2)} USD</span>
                </div>
                <div className="border-t border-border/30 pt-2 flex justify-between font-medium text-foreground">
                  <span>You receive</span>
                  <span className="text-primary">{receivedAmount.toFixed(8)} {toCurrency}</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              className="w-full rounded-xl h-12 text-base"
              disabled={isSubmitting || !fromCurrency || !toCurrency || amountNum <= 0 || amountNum > maxAmount}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Swapping...
                </>
              ) : fromCurrency && toCurrency ? (
                <>
                  Swap {fromCurrency} <ArrowRight className="mx-1 h-4 w-4" /> {toCurrency}
                </>
              ) : (
                "Select currencies"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-border/30 bg-card/30">
          <CardContent className="py-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <p>
                Swaps are executed instantly at live market rates from CoinGecko. A {SWAP_FEE_PERCENT * 100}% fee is applied to each swap.
                Prices are refreshed every 60 seconds.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
