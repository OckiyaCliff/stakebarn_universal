import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function AdminStakingPage() {
  const supabase = await createClient()

  // Fetch all stakes with user info
  const { data: stakes } = await supabase
    .from("stakes")
    .select("*, profiles(email), staking_plans(name)")
    .order("created_at", { ascending: false })

  // Fetch all staking plans
  const { data: plans } = await supabase.from("staking_plans").select("*").order("currency")

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Staking Management</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage stakes and staking plans</p>
      </div>

      <Tabs defaultValue="stakes" className="space-y-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="stakes" className="flex-1 md:flex-none">
            All Stakes
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex-1 md:flex-none">
            Staking Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stakes">
          <Card>
            <CardHeader>
              <CardTitle>All Stakes ({stakes?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <div className="min-w-[1000px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>APY</TableHead>
                        <TableHead>Rewards</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stakes?.map((stake: any) => (
                        <TableRow key={stake.id}>
                          <TableCell className="font-medium">{stake.profiles?.email || "Unknown"}</TableCell>
                          <TableCell>{stake.staking_plans?.name || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{stake.currency}</Badge>
                          </TableCell>
                          <TableCell>{Number(stake.amount).toFixed(8)}</TableCell>
                          <TableCell>{stake.apy}%</TableCell>
                          <TableCell className="text-emerald-500">{Number(stake.rewards_earned).toFixed(8)}</TableCell>
                          <TableCell>
                            <Badge variant={stake.status === "active" ? "default" : "secondary"}>{stake.status}</Badge>
                          </TableCell>
                          <TableCell>{new Date(stake.start_date).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Staking Plans ({plans?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <div className="min-w-[700px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Currency</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>APY</TableHead>
                        <TableHead>Lockup Days</TableHead>
                        <TableHead>Min Stake</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plans?.map((plan: any) => (
                        <TableRow key={plan.id}>
                          <TableCell>
                            <Badge variant="outline">{plan.currency}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{plan.name}</TableCell>
                          <TableCell className="text-emerald-500">{plan.apy}%</TableCell>
                          <TableCell>{plan.lockup_days === 0 ? "Flexible" : `${plan.lockup_days} days`}</TableCell>
                          <TableCell>{Number(plan.min_stake).toFixed(8)}</TableCell>
                          <TableCell>
                            <Badge variant={plan.is_active ? "default" : "secondary"}>
                              {plan.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
