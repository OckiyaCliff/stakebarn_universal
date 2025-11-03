"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface StakingPlan {
  id: string
  currency: string
  name: string
  apy: string | number
  lockup_days: number
  min_stake: string | number
  is_active: boolean
}

interface AdminStakeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userEmail: string
  availableBalance: number
  currency: string
  onSuccess?: () => void
}

export function AdminStakeDialog({
  open,
  onOpenChange,
  userId,
  userEmail,
  availableBalance,
  currency,
  onSuccess,
}: AdminStakeDialogProps) {
  const [amount, setAmount] = useState("")
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [plans, setPlans] = useState<StakingPlan[]>([])
  const [loadingPlans, setLoadingPlans] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const selectedPlan = plans.find((p) => p.id === selectedPlanId)

  useEffect(() => {
    if (open && currency) {
      fetchPlans()
    }
  }, [open, currency])

  const fetchPlans = async () => {
    setLoadingPlans(true)
    try {
      const response = await fetch("/api/admin/staking-plans")
      const data = await response.json()

      if (response.ok) {
        // Filter plans by currency and active status
        const filteredPlans = data.plans?.filter(
          (p: StakingPlan) => p.currency === currency && p.is_active,
        ) || []
        setPlans(filteredPlans)

        if (filteredPlans.length === 0) {
          setError(`No active staking plans available for ${currency}`)
        }
      } else {
        setError("Failed to load staking plans")
      }
    } catch (err) {
      setError("Failed to load staking plans")
      console.error("Error fetching plans:", err)
    } finally {
      setLoadingPlans(false)
    }
  }

  const handleStake = async () => {
    if (!selectedPlanId || !amount) {
      setError("Please select a plan and enter an amount")
      return
    }

    setIsLoading(true)
    setError(null)

    const stakeAmount = Number.parseFloat(amount)
    const minStake = selectedPlan ? Number.parseFloat(selectedPlan.min_stake.toString()) : 0

    if (stakeAmount < minStake) {
      setError(`Minimum stake is ${minStake} ${currency}`)
      setIsLoading(false)
      return
    }

    if (stakeAmount > availableBalance) {
      setError("Insufficient balance")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/stake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: selectedPlanId,
          amount: stakeAmount,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Successfully staked ${stakeAmount} ${currency} for ${userEmail}`,
        })
        onOpenChange(false)
        setAmount("")
        setSelectedPlanId("")
        if (onSuccess) {
          onSuccess()
        }
      } else {
        setError(data.error || "Failed to create stake")
        toast({
          title: "Error",
          description: data.error || "Failed to create stake",
          variant: "destructive",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create stake"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Stake on Behalf of User</DialogTitle>
          <DialogDescription>
            Create a stake for {userEmail} ({currency})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="plan">Staking Plan</Label>
            <Select value={selectedPlanId} onValueChange={setSelectedPlanId} disabled={loadingPlans}>
              <SelectTrigger id="plan">
                <SelectValue placeholder={loadingPlans ? "Loading plans..." : "Select a plan"} />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - {plan.apy}% APY
                    {plan.lockup_days > 0 ? ` (${plan.lockup_days} days)` : " (Flexible)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPlan && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan Name</span>
                <span className="font-semibold">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">APY</span>
                <span className="font-semibold text-primary">{selectedPlan.apy}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lock Period</span>
                <span className="font-medium">
                  {selectedPlan.lockup_days === 0 ? "Flexible" : `${selectedPlan.lockup_days} days`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Minimum Stake</span>
                <span className="font-medium">
                  {Number.parseFloat(selectedPlan.min_stake.toString()).toFixed(8)} {currency}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Stake</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                step="0.00000001"
                min={selectedPlan ? Number.parseFloat(selectedPlan.min_stake.toString()) : 0}
                max={availableBalance}
                placeholder={`Min: ${selectedPlan ? Number.parseFloat(selectedPlan.min_stake.toString()).toFixed(8) : "0"}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button variant="outline" onClick={() => setAmount(availableBalance.toFixed(8))}>
                Max
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Available: {availableBalance.toFixed(8)} {currency}
            </p>
          </div>

          {selectedPlan && amount && Number.parseFloat(amount) > 0 && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Daily Rewards</span>
                <span className="font-medium">
                  {((Number.parseFloat(amount) * Number.parseFloat(selectedPlan.apy.toString())) / 100 / 365).toFixed(8)}{" "}
                  {currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Annual Rewards</span>
                <span className="font-semibold text-primary">
                  {((Number.parseFloat(amount) * Number.parseFloat(selectedPlan.apy.toString())) / 100).toFixed(8)}{" "}
                  {currency}
                </span>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleStake} disabled={isLoading || !selectedPlanId || !amount || loadingPlans}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Stake...
              </>
            ) : (
              "Create Stake"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

