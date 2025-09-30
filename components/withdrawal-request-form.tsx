"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Balance {
  id: string
  currency: string
  available_balance: number
  total_rewards: number
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

  const selectedBalance = balances.find((b) => b.currency === currency)
  const maxAmount =
    withdrawalType === "balance" ? selectedBalance?.available_balance || 0 : selectedBalance?.total_rewards || 0

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
                      ? Number.parseFloat(balance.available_balance.toString()).toFixed(8)
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
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
