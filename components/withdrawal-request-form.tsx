"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2, Info } from "lucide-react"
import { toast } from "sonner"

interface Balance {
  id: string
  currency: string
  available_balance: number
  total_rewards: number
  bonus_balance?: number
}

interface WithdrawalRequestFormProps {
  balances: Balance[]
}

export function WithdrawalRequestForm({ balances }: WithdrawalRequestFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [withdrawalType, setWithdrawalType] = useState<"balance" | "profit">("balance")
  const [currency, setCurrency] = useState("")
  const [amount, setAmount] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [hasDeposit, setHasDeposit] = useState(false)

  useEffect(() => {
    // Check if user has made at least one deposit (for profit withdrawal eligibility)
    async function checkDeposits() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { count } = await supabase
        .from("deposits")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "confirmed")

      setHasDeposit((count || 0) > 0)
    }
    checkDeposits()
  }, [])

  const selectedBalance = balances.find((b) => b.currency === currency)

  // For balance withdrawal: subtract bonus_balance (not withdrawable)
  const bonusAmount = selectedBalance?.bonus_balance
    ? parseFloat(selectedBalance.bonus_balance.toString())
    : 0

  const withdrawableBalance = Math.max(
    0,
    (selectedBalance?.available_balance || 0) - bonusAmount
  )

  const maxAmount =
    withdrawalType === "balance"
      ? withdrawableBalance
      : selectedBalance?.total_rewards || 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currency || !amount || !walletAddress) {
      toast.error("Please fill in all fields")
      return
    }

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    if (amountNum > maxAmount) {
      toast.error(`Insufficient ${withdrawalType === "balance" ? "balance" : "rewards"}`)
      return
    }

    // Profit withdrawal requires at least one deposit
    if (withdrawalType === "profit" && !hasDeposit) {
      toast.error("You need to make at least one deposit before withdrawing profits")
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please sign in to continue")
        return
      }

      const { error } = await supabase.from("withdrawals").insert({
        user_id: user.id,
        withdrawal_type: withdrawalType,
        currency,
        amount: amountNum,
        wallet_address: walletAddress,
        status: "pending",
        requested_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success("Withdrawal request submitted successfully!")

      // Reset form
      setWithdrawalType("balance")
      setCurrency("")
      setAmount("")
      setWalletAddress("")

      // Refresh the page to show the new withdrawal
      router.refresh()
    } catch (error) {
      console.error("Error submitting withdrawal:", error)
      toast.error("Failed to submit withdrawal request")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Withdrawal</CardTitle>
        <CardDescription>Submit a withdrawal request for your funds or rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Withdrawal Type */}
          <div className="space-y-3">
            <Label>Withdrawal Type</Label>
            <RadioGroup
              value={withdrawalType}
              onValueChange={(value) => setWithdrawalType(value as "balance" | "profit")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="balance" id="balance" />
                <Label htmlFor="balance" className="font-normal cursor-pointer">
                  Available Balance
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="profit" id="profit" />
                <Label htmlFor="profit" className="font-normal cursor-pointer">
                  Rewards/Profit
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Bonus restriction notice */}
          {withdrawalType === "balance" && bonusAmount > 0 && currency && (
            <Alert className="border-yellow-500/30 bg-yellow-500/5">
              <Info className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-sm">
                Your ${bonusAmount.toFixed(8)} {currency} welcome bonus is not withdrawable from balance.
                Withdrawable balance: {withdrawableBalance.toFixed(8)} {currency}.
                You can only withdraw profits earned from staking the bonus.
              </AlertDescription>
            </Alert>
          )}

          {/* Profit withdrawal restriction */}
          {withdrawalType === "profit" && !hasDeposit && (
            <Alert className="border-yellow-500/30 bg-yellow-500/5">
              <Info className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-sm">
                You need to make at least one deposit before withdrawing staking profits.
                This ensures the security and integrity of your account.
              </AlertDescription>
            </Alert>
          )}

          {/* Currency Selection */}
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {balances.map((balance) => (
                  <SelectItem key={balance.id} value={balance.currency}>
                    {balance.currency} (Available:{" "}
                    {withdrawalType === "balance"
                      ? Math.max(0, Number.parseFloat(balance.available_balance.toString()) - (balance.bonus_balance ? parseFloat(balance.bonus_balance.toString()) : 0)).toFixed(8)
                      : Number.parseFloat(balance.total_rewards.toString()).toFixed(8)}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                step="0.00000001"
                placeholder="0.00000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!currency}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setAmount(maxAmount.toString())}
                disabled={!currency}
              >
                Max
              </Button>
            </div>
            {currency && (
              <p className="text-sm text-muted-foreground">
                Maximum: {maxAmount.toFixed(8)} {currency}
              </p>
            )}
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <Label htmlFor="wallet">Your Wallet Address</Label>
            <Input
              id="wallet"
              type="text"
              placeholder="Enter your wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Make sure this is a valid {currency || "cryptocurrency"} wallet address
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || (withdrawalType === "profit" && !hasDeposit)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Withdrawal Request"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
