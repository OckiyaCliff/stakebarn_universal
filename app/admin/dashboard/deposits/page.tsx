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
import { CheckCircle, XCircle, Loader2, ExternalLink, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Deposit {
  id: string
  user_id: string
  amount: number
  currency: string
  status: string
  tx_hash: string | null
  wallet_address: string | null
  proof_image_url: string | null
  created_at: string
  admin_notes: string | null
  profiles: {
    email: string
  }
}

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null)
  const [action, setAction] = useState<"approve" | "decline" | null>(null)
  const [notes, setNotes] = useState("")
  const [processing, setProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("pending")
  const { toast } = useToast()

  useEffect(() => {
    console.log("Deposits page mounted, fetching deposits for tab:", activeTab)
    fetchDeposits(activeTab)
  }, [activeTab])

  const fetchDeposits = async (status: string) => {
    setLoading(true)
    try {
      console.log("Fetching deposits with status:", status)
      const response = await fetch(`/api/admin/deposits?status=${status}`)
      console.log("Deposits API response status:", response.status)

      const data = await response.json()
      console.log("Deposits API response data:", data)

      if (response.ok) {
        setDeposits(data.deposits)
        console.log("Successfully loaded", data.deposits.length, "deposits")
      } else {
        console.error("Failed to fetch deposits:", data.error)
        toast({
          title: "Error",
          description: data.error || "Failed to fetch deposits",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching deposits:", error)
      toast({
        title: "Error",
        description: "Failed to fetch deposits",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (deposit: Deposit, actionType: "approve" | "decline") => {
    console.log("Opening dialog to", actionType, "deposit:", deposit.id)
    setSelectedDeposit(deposit)
    setAction(actionType)
    setNotes("")
  }

  const handleSubmit = async () => {
    if (!selectedDeposit || !action) return

    console.log("Submitting", action, "for deposit:", selectedDeposit.id, "with notes:", notes)
    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/deposits/${selectedDeposit.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })

      console.log("Action response status:", response.status)
      const data = await response.json()
      console.log("Action response data:", data)

      if (response.ok) {
        toast({
          title: "Success",
          description: `Deposit ${action}d successfully`,
        })
        setSelectedDeposit(null)
        setAction(null)
        setNotes("")
        fetchDeposits(activeTab)
      } else {
        console.error("Failed to", action, "deposit:", data.error)
        toast({
          title: "Error",
          description: data.error || `Failed to ${action} deposit`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting action:", error)
      toast({
        title: "Error",
        description: `Failed to ${action} deposit`,
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
      declined: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
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
        <h1 className="text-2xl md:text-3xl font-bold">Deposit Management</h1>
        <p className="text-muted-foreground">Review and approve user deposits</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>TX Hash</TableHead>
                      <TableHead>Proof</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      {activeTab === "pending" && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deposits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          No {activeTab} deposits found
                        </TableCell>
                      </TableRow>
                    ) : (
                      deposits.map((deposit) => (
                        <TableRow key={deposit.id}>
                          <TableCell className="font-medium">{deposit.profiles?.email}</TableCell>
                          <TableCell>
                            {deposit.amount} {deposit.currency}
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">{deposit.wallet_address || "N/A"}</TableCell>
                          <TableCell>
                            {deposit.tx_hash ? (
                              <a
                                href={`https://etherscan.io/tx/${deposit.tx_hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-500 hover:underline"
                              >
                                <span className="max-w-[100px] truncate">{deposit.tx_hash}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>
                            {deposit.proof_image_url ? (
                              <a
                                href={deposit.proof_image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-500 hover:underline"
                              >
                                <ImageIcon className="h-4 w-4" />
                                View
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>{new Date(deposit.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                          {activeTab === "pending" && (
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="default" onClick={() => handleAction(deposit, "approve")}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleAction(deposit, "decline")}
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

      <Dialog open={!!selectedDeposit} onOpenChange={() => setSelectedDeposit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "Approve" : "Decline"} Deposit</DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? "This will credit the user's account with the deposit amount."
                : "This will reject the deposit request."}
            </DialogDescription>
          </DialogHeader>
          {selectedDeposit && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User:</span>
                  <span className="text-sm font-medium">{selectedDeposit.profiles?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="text-sm font-medium">
                    {selectedDeposit.amount} {selectedDeposit.currency}
                  </span>
                </div>
                {selectedDeposit.tx_hash && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">TX Hash:</span>
                    <span className="text-sm font-medium truncate max-w-[200px]">{selectedDeposit.tx_hash}</span>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="notes">Notes {action === "decline" && "(Required)"}</Label>
                <Textarea
                  id="notes"
                  placeholder={
                    action === "approve" ? "Optional notes about this approval..." : "Reason for declining..."
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDeposit(null)} disabled={processing}>
              Cancel
            </Button>
            <Button
              variant={action === "approve" ? "default" : "destructive"}
              onClick={handleSubmit}
              disabled={processing || (action === "decline" && !notes.trim())}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : action === "approve" ? "Approve" : "Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
