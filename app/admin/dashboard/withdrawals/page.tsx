"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Withdrawal {
  id: string
  user_id: string
  withdrawal_type: string
  amount: number
  currency: string
  wallet_address: string
  status: string
  approval_condition: string
  condition_met: boolean
  admin_notes: string | null
  requested_at: string
  reviewed_at: string | null
  processed_at: string | null
  profiles: {
    email: string
  }
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [notes, setNotes] = useState("")
  const [approvalCondition, setApprovalCondition] = useState("none")
  const [processing, setProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("pending")
  const { toast } = useToast()

  useEffect(() => {
    console.log("Withdrawals page mounted, fetching withdrawals for tab:", activeTab)
    fetchWithdrawals(activeTab)
  }, [activeTab])

  const fetchWithdrawals = async (status: string) => {
    setLoading(true)
    try {
      console.log("Fetching withdrawals with status:", status)
      const response = await fetch(`/api/admin/withdrawals?status=${status}`)
      console.log("Withdrawals API response status:", response.status)

      const data = await response.json()
      console.log("Withdrawals API response data:", data)

      if (response.ok) {
        setWithdrawals(data.withdrawals)
        console.log("Successfully loaded", data.withdrawals.length, "withdrawals")
      } else {
        console.error("Failed to fetch withdrawals:", data.error)
        toast({
          title: "Error",
          description: data.error || "Failed to fetch withdrawals",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error)
      toast({
        title: "Error",
        description: "Failed to fetch withdrawals",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (withdrawal: Withdrawal, actionType: "approve" | "reject") => {
    console.log("Opening dialog to", actionType, "withdrawal:", withdrawal.id)
    setSelectedWithdrawal(withdrawal)
    setAction(actionType)
    setNotes("")
    setApprovalCondition("none")
  }

  const handleSubmit = async () => {
    if (!selectedWithdrawal || !action) return

    console.log("Submitting", action, "for withdrawal:", selectedWithdrawal.id, "with notes:", notes)
    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/withdrawals/${selectedWithdrawal.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes,
          approval_condition: action === "approve" ? approvalCondition : undefined,
        }),
      })

      console.log("Action response status:", response.status)
      const data = await response.json()
      console.log("Action response data:", data)

      if (response.ok) {
        toast({
          title: "Success",
          description: `Withdrawal ${action}ed successfully`,
        })
        setSelectedWithdrawal(null)
        setAction(null)
        setNotes("")
        setApprovalCondition("none")
        fetchWithdrawals(activeTab)
      } else {
        console.error("Failed to", action, "withdrawal:", data.error)
        toast({
          title: "Error",
          description: data.error || `Failed to ${action} withdrawal`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting action:", error)
      toast({
        title: "Error",
        description: `Failed to ${action} withdrawal`,
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      completed: "default",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Withdrawal Management</h1>
        <p className="text-muted-foreground">Review and approve user withdrawal requests</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      {activeTab === "pending" && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          No {activeTab} withdrawals found
                        </TableCell>
                      </TableRow>
                    ) : (
                      withdrawals.map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell className="font-medium">{withdrawal.profiles?.email}</TableCell>
                          <TableCell className="capitalize">{withdrawal.withdrawal_type}</TableCell>
                          <TableCell>
                            {withdrawal.amount} {withdrawal.currency}
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate font-mono text-xs">
                            {withdrawal.wallet_address}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getConditionLabel(withdrawal.approval_condition)}
                              {withdrawal.approval_condition !== "none" &&
                                (withdrawal.condition_met ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                ))}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(withdrawal.requested_at).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                          {activeTab === "pending" && (
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="default" onClick={() => handleAction(withdrawal, "approve")}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleAction(withdrawal, "reject")}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "Approve" : "Reject"} Withdrawal</DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? "This will approve the withdrawal request. You can set conditions that must be met before processing."
                : "This will reject the withdrawal request."}
            </DialogDescription>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User:</span>
                  <span className="text-sm font-medium">{selectedWithdrawal.profiles?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm font-medium capitalize">{selectedWithdrawal.withdrawal_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="text-sm font-medium">
                    {selectedWithdrawal.amount} {selectedWithdrawal.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Wallet:</span>
                  <span className="text-sm font-medium font-mono truncate max-w-[300px]">
                    {selectedWithdrawal.wallet_address}
                  </span>
                </div>
              </div>

              {action === "approve" && (
                <div className="space-y-2">
                  <Label htmlFor="condition">Approval Condition</Label>
                  <Select value={approvalCondition} onValueChange={setApprovalCondition}>
                    <SelectTrigger id="condition">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Condition - Approve Freely</SelectItem>
                      <SelectItem value="minimum_stake">Minimum Stake - User must have $100 staked</SelectItem>
                      <SelectItem value="minimum_deposits">
                        Minimum Deposits - User must have $500 in deposits
                      </SelectItem>
                      <SelectItem value="account_age">Account Age - Account must be 30+ days old</SelectItem>
                    </SelectContent>
                  </Select>
                  {approvalCondition !== "none" && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        The withdrawal will be approved, but the user must meet the selected condition before it can be
                        processed.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notes {action === "reject" && "(Required)"}</Label>
                <Textarea
                  id="notes"
                  placeholder={
                    action === "approve" ? "Optional notes about this approval..." : "Reason for rejecting..."
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedWithdrawal(null)} disabled={processing}>
              Cancel
            </Button>
            <Button
              variant={action === "approve" ? "default" : "destructive"}
              onClick={handleSubmit}
              disabled={processing || (action === "reject" && !notes.trim())}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
