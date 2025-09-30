import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Fetch all users with their balances
  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  const usersWithBalances = await Promise.all(
    (profiles || []).map(async (profile) => {
      const { data: balances } = await supabase.from("balances").select("*").eq("user_id", profile.id)

      const { count: stakesCount } = await supabase
        .from("stakes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id)
        .eq("status", "active")

      return {
        ...profile,
        balances: balances || [],
        activeStakes: stakesCount || 0,
      }
    }),
  )

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage all platform users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({usersWithBalances.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Active Stakes</TableHead>
                    <TableHead>Balances</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersWithBalances.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{user.activeStakes}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.balances.length > 0 ? (
                            user.balances.map((balance: any) => (
                              <Badge key={balance.id} variant="outline" className="text-xs">
                                {balance.currency}: {Number(balance.available_balance).toFixed(4)}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No balances</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Active</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
