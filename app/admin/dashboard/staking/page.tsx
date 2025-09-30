"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import { Loader2, Plus, Pencil, Trash2, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Stake {
  id: string
  user_id: string
  amount: number
  currency: string
  status: string
  apy: number
  lockup_days: number
  rewards_earned: number
  start_date: string
  end_date: string | null
  profiles: {
    email: string
  }
  staking_plans: {
    name: string
    apy: number
  }
}

interface StakingPlan {
  id: string
  name: string
  apy: number
  lockup_days: number
  min_stake: number
  currency: string
  is_active: boolean
}

export default function StakingPage() {
  const [stakes, setStakes] = useState<Stake[]>([])
  const [plans, setPlans] = useState<StakingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("stakes")
  const [editingPlan, setEditingPlan] = useState<StakingPlan | null>(null)
  const [isNewPlan, setIsNewPlan] = useState(false)
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    console.log("Staking page mounted, fetching data")
    fetchStakes()
    fetchPlans()
  }, [])

  const fetchStakes = async () => {
    try {
      console.log("Fetching active stakes")
      const response = await fetch("/api/admin/stakes?status=active")
      console.log("Stakes API response status:", response.status)

      const data = await response.json()
      console.log("Stakes API response data:", data)

      if (response.ok) {
        setStakes(data.stakes)
        console.log("Successfully loaded", data.stakes.length, "stakes")
      } else {
        console.error("Failed to fetch stakes:", data.error)
      }
    } catch (error) {
      console.error("Error fetching stakes:", error)
      toast({
        title: "Error",
        description: "Failed to fetch stakes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPlans = async () => {
    try {
      console.log("Fetching staking plans")
      const response = await fetch("/api/admin/staking-plans")
      console.log("Plans API response status:", response.status)

      const data = await response.json()
      console.log("Plans API response data:", data)

      if (response.ok) {
        setPlans(data.plans)
        console.log("Successfully loaded", data.plans.length, "plans")
      } else {
        console.error("Failed to fetch plans:", data.error)
      }
    } catch (error) {
      console.error("Error fetching plans:", error)
      toast({
        title: "Error",
        description: "Failed to fetch plans",
        variant: "destructive",
      })
    }
  }

  const handleCancelStake = async (stakeId: string) => {
    if (!confirm("Are you sure you want to cancel this stake?")) return

    console.log("Cancelling stake:", stakeId)
    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/stakes/${stakeId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Cancelled by admin" }),
      })

      console.log("Cancel stake response status:", response.status)
      const data = await response.json()
      console.log("Cancel stake response data:", data)

      if (response.ok) {
        toast({
          title: "Success",
          description: "Stake cancelled successfully",
        })
        fetchStakes()
      } else {
        console.error("Failed to cancel stake:", data.error)
        toast({
          title: "Error",
          description: data.error || "Failed to cancel stake",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error cancelling stake:", error)
      toast({
        title: "Error",
        description: "Failed to cancel stake",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleSavePlan = async () => {
    if (!editingPlan) return

    console.log("Saving plan:", editingPlan, "isNew:", isNewPlan)
    setProcessing(true)
    try {
      const url = isNewPlan ? "/api/admin/staking-plans" : `/api/admin/staking-plans/${editingPlan.id}`
      const method = isNewPlan ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPlan),
      })

      console.log("Save plan response status:", response.status)
      const data = await response.json()
      console.log("Save plan response data:", data)

      if (response.ok) {
        toast({
          title: "Success",
          description: `Plan ${isNewPlan ? "created" : "updated"} successfully`,
        })
        setEditingPlan(null)
        setIsNewPlan(false)
        fetchPlans()
      } else {
        console.error("Failed to save plan:", data.error)
        toast({
          title: "Error",
          description: data.error || "Failed to save plan",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving plan:", error)
      toast({
        title: "Error",
        description: "Failed to save plan",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return

    console.log("Deleting plan:", planId)
    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/staking-plans/${planId}`, {
        method: "DELETE",
      })

      console.log("Delete plan response status:", response.status)
      const data = await response.json()
      console.log("Delete plan response data:", data)

      if (response.ok) {
        toast({
          title: "Success",
          description: "Plan deleted successfully",
        })
        fetchPlans()
      } else {
        console.error("Failed to delete plan:", data.error)
        toast({
          title: "Error",
          description: data.error || "Failed to delete plan",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting plan:", error)
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
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
        <h1 className="text-2xl md:text-3xl font-bold">Staking Management</h1>
        <p className="text-muted-foreground">Manage stakes and staking plans</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="stakes">Active Stakes</TabsTrigger>
          <TabsTrigger value="plans">Staking Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="stakes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Stakes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>APY</TableHead>
                      <TableHead>Rewards</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stakes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          No active stakes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      stakes.map((stake) => (
                        <TableRow key={stake.id}>
                          <TableCell className="font-medium">{stake.profiles?.email}</TableCell>
                          <TableCell>
                            {stake.amount} {stake.currency}
                          </TableCell>
                          <TableCell>{stake.staking_plans?.name}</TableCell>
                          <TableCell>{stake.apy}%</TableCell>
                          <TableCell>{stake.rewards_earned.toFixed(2)}</TableCell>
                          <TableCell>{new Date(stake.start_date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {stake.end_date ? new Date(stake.end_date).toLocaleDateString() : "Active"}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelStake(stake.id)}
                              disabled={processing}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Staking Plans</CardTitle>
              <Button
                onClick={() => {
                  setEditingPlan({
                    id: "",
                    name: "",
                    apy: 0,
                    lockup_days: 0,
                    min_stake: 0,
                    currency: "USDT",
                    is_active: true,
                  })
                  setIsNewPlan(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>APY</TableHead>
                      <TableHead>Lockup Days</TableHead>
                      <TableHead>Min Stake</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>{plan.apy}%</TableCell>
                        <TableCell>{plan.lockup_days} days</TableCell>
                        <TableCell>
                          {plan.min_stake} {plan.currency}
                        </TableCell>
                        <TableCell>{plan.currency}</TableCell>
                        <TableCell>
                          <Badge variant={plan.is_active ? "default" : "secondary"}>
                            {plan.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingPlan(plan)
                                setIsNewPlan(false)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeletePlan(plan.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewPlan ? "Create" : "Edit"} Staking Plan</DialogTitle>
            <DialogDescription>Configure the staking plan details</DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="apy">APY (%)</Label>
                  <Input
                    id="apy"
                    type="number"
                    step="0.01"
                    value={editingPlan.apy}
                    onChange={(e) => setEditingPlan({ ...editingPlan, apy: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="lockup">Lockup Days</Label>
                  <Input
                    id="lockup"
                    type="number"
                    value={editingPlan.lockup_days}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, lockup_days: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_stake">Min Stake</Label>
                  <Input
                    id="min_stake"
                    type="number"
                    step="0.01"
                    value={editingPlan.min_stake}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, min_stake: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={editingPlan.currency}
                    onChange={(e) => setEditingPlan({ ...editingPlan, currency: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={editingPlan.is_active}
                  onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlan(null)} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan} disabled={processing}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
