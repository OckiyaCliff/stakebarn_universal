"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Lock, Unlock } from "lucide-react"
import { useState } from "react"
import { StakeDialog } from "./stake-dialog"

interface StakingPlan {
  id: string
  currency: string
  name: string
  apy: string
  lockup_days: number
  min_stake: string
  is_active: boolean
}

interface StakingPlanCardProps {
  plan: StakingPlan
  availableBalance: number
  userId: string
}

export function StakingPlanCard({ plan, availableBalance, userId }: StakingPlanCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const isFlexible = plan.lockup_days === 0
  const minStake = Number.parseFloat(plan.min_stake.toString())
  const canStake = availableBalance >= minStake

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>{plan.currency}</CardDescription>
            </div>
            {isFlexible ? (
              <Badge variant="outline" className="gap-1">
                <Unlock className="h-3 w-3" />
                Flexible
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" />
                {plan.lockup_days}d
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">{plan.apy}%</span>
              <span className="text-sm text-muted-foreground">APY</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Annual Percentage Yield</span>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minimum Stake</span>
              <span className="font-medium">
                {minStake} {plan.currency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lock Period</span>
              <span className="font-medium">{isFlexible ? "None" : `${plan.lockup_days} days`}</span>
            </div>
          </div>

          <Button className="w-full" disabled={!canStake} onClick={() => setDialogOpen(true)}>
            {!canStake ? "Insufficient Balance" : "Stake Now"}
          </Button>
        </CardContent>
      </Card>

      <StakeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        plan={plan}
        availableBalance={availableBalance}
        userId={userId}
      />
    </>
  )
}
