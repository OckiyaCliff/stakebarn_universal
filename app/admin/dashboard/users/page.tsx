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
import { Pencil, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
                  <TableHead>Available Balance</TableHead>
                  <TableHead>Staked Balance</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const balance = user.balances?.[0] || {
                    currency: "USDT",
                    available_balance: 0,
                    staked_balance: 0,
                  }
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        {balance.available_balance} {balance.currency}
                      </TableCell>
                      <TableCell>
                        {balance.staked_balance} {balance.currency}
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEditBalance(user, balance as Balance)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
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
            <DialogDescription>Update the balance for {editingUser?.email}</DialogDescription>
          </DialogHeader>
          {editBalance && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={editBalance.currency}
                  onChange={(e) => setEditBalance({ ...editBalance, currency: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="available">Available Balance</Label>
                <Input
                  id="available"
                  type="number"
                  step="0.01"
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
                  step="0.01"
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
    </div>
  )
}
