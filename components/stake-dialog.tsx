"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface StakingPlan {
  id: string
  currency: string
  name: string
  apy: string
  lockup_days: number
  min_stake: string
}

interface StakeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: StakingPlan
  availableBalance: number
  userId: string
}

export function StakeDialog({ open, onOpenChange, plan, availableBalance, userId }: StakeDialogProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const minStake = Number.parseFloat(plan.min_stake.toString())
  const stakeAmount = Number.parseFloat(amount) || 0

  const handleStake = async () => {
    setIsLoading(true)
    setError(null)

    if (stakeAmount < minStake) {
      setError(`Minimum stake is ${minStake} ${plan.currency}`)
      setIsLoading(false)
      return
    }

    if (stakeAmount > availableBalance) {
      setError("Insufficient balance")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      // Calculate end date if lockup period exists
      const endDate = plan.lockup_days > 0 ? new Date(Date.now() + plan.lockup_days * 24 * 60 * 60 * 1000) : null

      // Create stake
      const { error: stakeError } = await supabase.from("stakes").insert({
        user_id: userId,
        plan_id: plan.id,
        currency: plan.currency,
        amount: stakeAmount,
        apy: plan.apy,
        lockup_days: plan.lockup_days,
        end_date: endDate,
        status: "active",
      })

      if (stakeError) throw stakeError

      // Update balances
      const { data: currentBalance } = await supabase
        .from("balances")
        .select("*")
        .eq("user_id", userId)
        .eq("currency", plan.currency)
        .single()

      if (currentBalance) {
        const newAvailable = Number.parseFloat(currentBalance.available_balance.toString()) - stakeAmount
        const newStaked = Number.parseFloat(currentBalance.staked_balance.toString()) + stakeAmount

        const { error: updateError } = await supabase
          .from("balances")
          .update({
            available_balance: newAvailable,
            staked_balance: newStaked,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentBalance.id)

        if (updateError) throw updateError
      }

      onOpenChange(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create stake")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stake {plan.currency}</DialogTitle>
          <DialogDescription>{plan.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">APY</span>
              <span className="font-semibold text-primary">{plan.apy}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lock Period</span>
              <span className="font-medium">{plan.lockup_days === 0 ? "Flexible" : `${plan.lockup_days} days`}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Available Balance</span>
              <span className="font-medium">
                {availableBalance.toFixed(8)} {plan.currency}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Stake</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                step="0.00000001"
                min={minStake}
                max={availableBalance}
                placeholder={`Min: ${minStake}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button variant="outline" onClick={() => setAmount(availableBalance.toString())}>
                Max
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum: {minStake} {plan.currency}
            </p>
          </div>

          {stakeAmount > 0 && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Daily Rewards</span>
                <span className="font-medium">
                  {((stakeAmount * Number.parseFloat(plan.apy.toString())) / 100 / 365).toFixed(8)} {plan.currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Annual Rewards</span>
                <span className="font-semibold text-primary">
                  {((stakeAmount * Number.parseFloat(plan.apy.toString())) / 100).toFixed(8)} {plan.currency}
                </span>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button className="w-full" onClick={handleStake} disabled={isLoading || !amount}>
            {isLoading ? "Creating Stake..." : "Confirm Stake"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
