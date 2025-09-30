"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface Withdrawal {
  id: string
  withdrawal_type: string
  currency: string
  amount: number
  wallet_address: string
  status: string
  approval_condition: string
  condition_met: boolean
  current_condition_met?: boolean
  admin_notes: string | null
  requested_at: string
  reviewed_at: string | null
  processed_at: string | null
}

export function WithdrawalStatusCard() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWithdrawalStatus()
    // Poll every 30 seconds for updates
    const interval = setInterval(fetchWithdrawalStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchWithdrawalStatus = async () => {
    try {
      const response = await fetch("/api/withdrawals/status")
      const data = await response.json()
      if (response.ok) {
        setWithdrawals(data.withdrawals)
      }
    } catch (error) {
      console.error("Error fetching withdrawal status:", error)
    } finally {
      setLoading(false)
    }
  }

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
      none: "No Condition",
      minimum_stake: "Minimum Stake ($100)",
      minimum_deposits: "Minimum Deposits ($500)",
      account_age: "Account Age (30 days)",
    }
    return labels[condition] || condition
  }

  const getStatusIcon = (withdrawal: Withdrawal) => {
    if (withdrawal.status === "completed") {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    if (withdrawal.status === "rejected") {
      return <XCircle className="h-5 w-5 text-red-500" />
    }
    if (withdrawal.status === "approved") {
      if (withdrawal.approval_condition === "none" || withdrawal.condition_met) {
        return <Clock className="h-5 w-5 text-blue-500" />
      }
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
    return <Clock className="h-5 w-5 text-gray-500" />
  }

  const getStatusMessage = (withdrawal: Withdrawal) => {
    if (withdrawal.status === "completed") {
      return "Withdrawal completed and sent to your wallet"
    }
    if (withdrawal.status === "rejected") {
      return withdrawal.admin_notes || "Withdrawal was rejected"
    }
    if (withdrawal.status === "approved") {
      if (withdrawal.approval_condition === "none") {
        return "Withdrawal approved and will be processed shortly"
      }
      if (withdrawal.condition_met) {
        return "Condition met! Withdrawal will be processed shortly"
      }
      const currentlyMet = withdrawal.current_condition_met
      return (
        <div className="space-y-1">
          <p>Withdrawal approved with condition: {getConditionLabel(withdrawal.approval_condition)}</p>
          <p className="text-sm">
            Status:{" "}
            {currentlyMet ? (
              <span className="text-green-500 font-medium">Condition Met ✓</span>
            ) : (
              <span className="text-yellow-500 font-medium">Waiting for condition</span>
            )}
          </p>
        </div>
      )
    }
    return "Withdrawal request is pending admin review"
  }

  if (loading) {
    return null
  }

  const activeWithdrawals = withdrawals.filter((w) => w.status !== "completed" && w.status !== "rejected")

  if (activeWithdrawals.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Withdrawal Requests</CardTitle>
        <CardDescription>Track the status of your pending withdrawals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeWithdrawals.map((withdrawal) => (
          <div key={withdrawal.id} className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(withdrawal)}
                <div>
                  <div className="font-semibold">
                    {withdrawal.amount} {withdrawal.currency}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">{withdrawal.withdrawal_type}</div>
                </div>
              </div>
              <Badge
                variant={
                  withdrawal.status === "approved"
                    ? "default"
                    : withdrawal.status === "pending"
                      ? "secondary"
                      : "destructive"
                }
              >
                {withdrawal.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">{getStatusMessage(withdrawal)}</div>
            <div className="text-xs text-muted-foreground font-mono">To: {withdrawal.wallet_address}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
