import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DepositActions } from "@/components/deposit-actions"

export default async function AdminDepositsPage() {
  const supabase = await createClient()

  // Fetch all deposits with user info
  const { data: deposits } = await supabase
    .from("deposits")
    .select("*, profiles(email)")
    .order("created_at", { ascending: false })

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Deposit Management</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage and confirm user deposits</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Deposits ({deposits?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>TX Hash</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deposits?.map((deposit: any) => (
                    <TableRow key={deposit.id}>
                      <TableCell className="font-medium">{deposit.profiles?.email || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{deposit.currency}</Badge>
                      </TableCell>
                      <TableCell>{Number(deposit.amount).toFixed(8)}</TableCell>
                      <TableCell className="max-w-[150px] truncate text-xs">{deposit.tx_hash || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            deposit.status === "confirmed"
                              ? "default"
                              : deposit.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {deposit.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(deposit.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DepositActions deposit={deposit} />
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
