"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CURRENCY_INFO, type Currency } from "@/lib/constants"

interface Balance {
  id: string
  currency: string
  total_rewards: number
}

interface User {
  id: string
  email: string
  created_at: string
  balances: Balance[]
}

export default function ProfitsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editBalance, setEditBalance] = useState<{ currency: string; total_rewards: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch users",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfits = (user: User, balance: Balance) => {
    setEditingUser(user)
    setEditBalance({
      currency: balance.currency,
      total_rewards: Number.parseFloat(balance.total_rewards.toString()),
    })
  }

  const handleCreateProfits = (user: User, currency: Currency) => {
    setEditingUser(user)
    setEditBalance({
      currency: currency,
      total_rewards: 0,
    })
  }

  const handleSaveProfits = async () => {
    if (!editingUser || !editBalance) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}/profits`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editBalance),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profits updated successfully",
        })
        setEditingUser(null)
        setEditBalance(null)
        fetchUsers()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update profits",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving profits:", error)
      toast({
        title: "Error",
        description: "Failed to update profits",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
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
        <h1 className="text-2xl md:text-3xl font-bold">Profits Management</h1>
        <p className="text-muted-foreground">Manage user profits and rewards manually</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Profits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Profits by Currency</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const userBalances = user.balances || []
                  const currencies = Object.keys(CURRENCY_INFO) as Currency[]

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        {userBalances.length > 0 ? (
                          <div className="space-y-1">
                            {userBalances
                              .filter((b) => Number.parseFloat(b.total_rewards.toString()) > 0)
                              .map((balance) => (
                                <div key={balance.id} className="flex items-center gap-2 text-sm">
                                  <span className="font-medium">{balance.currency}:</span>
                                  <span className="text-muted-foreground">
                                    {Number.parseFloat(balance.total_rewards.toString()).toFixed(8)}
                                  </span>
                                </div>
                              ))}
                            {userBalances.filter((b) => Number.parseFloat(b.total_rewards.toString()) > 0).length ===
                              0 && (
                              <span className="text-muted-foreground text-sm">No profits recorded</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No balances</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 flex-wrap">
                          {userBalances.map((balance) => (
                            <Button
                              key={balance.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProfits(user, balance)}
                              title={`Edit ${balance.currency} profits for ${user.email}`}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              {balance.currency}
                            </Button>
                          ))}
                          {/* Add button to create profits for currencies that don't have balances */}
                          {currencies
                            .filter((curr) => !userBalances.some((b) => b.currency === curr))
                            .map((currency) => (
                              <Button
                                key={currency}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCreateProfits(user, currency)}
                                title={`Add ${currency} profits for ${user.email}`}
                              >
                                + {currency}
                              </Button>
                            ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profits</DialogTitle>
            <DialogDescription>
              Update the {editBalance?.currency} profits for {editingUser?.email}
            </DialogDescription>
          </DialogHeader>
          {editBalance && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={editBalance.currency}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">Currency cannot be changed</p>
              </div>
              <div>
                <Label htmlFor="total_rewards">Total Rewards/Profits</Label>
                <Input
                  id="total_rewards"
                  type="number"
                  step="0.00000001"
                  min="0"
                  value={editBalance.total_rewards}
                  onChange={(e) =>
                    setEditBalance({ ...editBalance, total_rewards: Number.parseFloat(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This is the total accumulated profits/rewards for this currency
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfits} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

