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
import { Pencil, Loader2, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AdminStakeDialog } from "@/components/admin-stake-dialog"

interface Balance {
  id: string
  currency: string
  available_balance: number
  staked_balance: number
}

interface User {
  id: string
  email: string
  created_at: string
  balances: Balance[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editBalance, setEditBalance] = useState<Balance | null>(null)
  const [saving, setSaving] = useState(false)
  const [stakingUser, setStakingUser] = useState<{ user: User; balance: Balance } | null>(null)
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    console.log("Users page mounted, fetching users")
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      console.log("Fetching users from API")
      const response = await fetch("/api/admin/users")
      console.log("Users API response status:", response.status)

      const data = await response.json()
      console.log("Users API response data:", data)

      if (response.ok) {
        setUsers(data.users)
        console.log("Successfully loaded", data.users.length, "users")
      } else {
        console.error("Failed to fetch users:", data.error)
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

  const handleEditBalance = (user: User, balance: Balance) => {
    console.log("Opening edit dialog for user:", user.email, "balance:", balance)
    setEditingUser(user)
    setEditBalance({ ...balance })
  }

  const handleSaveBalance = async () => {
    if (!editingUser || !editBalance) return

    console.log("Saving balance for user:", editingUser.id, "new balance:", editBalance)
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}/balance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editBalance),
      })

      console.log("Save balance response status:", response.status)
      const data = await response.json()
      console.log("Save balance response data:", data)

      if (response.ok) {
        toast({
          title: "Success",
          description: "Balance updated successfully",
        })
        setEditingUser(null)
        setEditBalance(null)
        fetchUsers()
      } else {
        console.error("Failed to update balance:", data.error)
        toast({
          title: "Error",
          description: data.error || "Failed to update balance",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving balance:", error)
      toast({
        title: "Error",
        description: "Failed to update balance",
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
        <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts and balances</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Balances</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const userBalances = user.balances || []
                  const hasBalances = userBalances.length > 0

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        {hasBalances ? (
                          <div className="space-y-1">
                            {userBalances.map((balance) => (
                              <div key={balance.id} className="flex items-center gap-2 text-sm">
                                <span className="font-medium">{balance.currency}:</span>
                                <span className="text-muted-foreground">
                                  Available: {Number.parseFloat(balance.available_balance.toString()).toFixed(8)}
                                </span>
                                <span className="text-muted-foreground">|</span>
                                <span className="text-muted-foreground">
                                  Staked: {Number.parseFloat(balance.staked_balance.toString()).toFixed(8)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No balances</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 flex-wrap">
                          {hasBalances && (
                            <>
                              {userBalances.map((balance) => {
                                const available = Number.parseFloat(balance.available_balance.toString())
                                return (
                                  <div key={balance.id} className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setStakingUser({ user, balance })
                                        setStakeDialogOpen(true)
                                      }}
                                      disabled={available <= 0}
                                      title={`Stake ${balance.currency} for ${user.email}`}
                                    >
                                      <TrendingUp className="h-4 w-4 mr-1" />
                                      Stake {balance.currency}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditBalance(user, balance)}
                                      title={`Edit ${balance.currency} balance for ${user.email}`}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              })}
                            </>
                          )}
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
            <DialogTitle>Edit User Balance</DialogTitle>
            <DialogDescription>
              Update the {editBalance?.currency} balance for {editingUser?.email}
            </DialogDescription>
          </DialogHeader>
          {editBalance && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={editBalance.currency}
                  onChange={(e) => setEditBalance({ ...editBalance, currency: e.target.value })}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">Currency cannot be changed</p>
              </div>
              <div>
                <Label htmlFor="available">Available Balance</Label>
                <Input
                  id="available"
                  type="number"
                  step="0.00000001"
                  min="0"
                  value={editBalance.available_balance}
                  onChange={(e) =>
                    setEditBalance({ ...editBalance, available_balance: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="staked">Staked Balance</Label>
                <Input
                  id="staked"
                  type="number"
                  step="0.00000001"
                  min="0"
                  value={editBalance.staked_balance}
                  onChange={(e) =>
                    setEditBalance({ ...editBalance, staked_balance: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveBalance} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Stake Dialog */}
      {stakingUser && (
        <AdminStakeDialog
          open={stakeDialogOpen}
          onOpenChange={(open) => {
            setStakeDialogOpen(open)
            if (!open) {
              setStakingUser(null)
            }
          }}
          userId={stakingUser.user.id}
          userEmail={stakingUser.user.email}
          availableBalance={Number.parseFloat(stakingUser.balance.available_balance.toString())}
          currency={stakingUser.balance.currency}
          onSuccess={() => {
            fetchUsers()
          }}
        />
      )}
    </div>
  )
}
