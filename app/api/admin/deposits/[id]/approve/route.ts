import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { checkIsAdmin } from "@/lib/admin-auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAdmin, adminId } = await checkIsAdmin()
    console.log("Approve deposit - isAdmin:", isAdmin, "adminId:", adminId)

    if (!isAdmin || !adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { notes } = await request.json()
    const supabase = getAdminClient()

    console.log("Fetching deposit:", params.id)
    // Get deposit details
    const { data: deposit, error: depositError } = await supabase
      .from("deposits")
      .select("*")
      .eq("id", params.id)
      .single()

    if (depositError || !deposit) {
      console.error("Deposit not found:", depositError)
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 })
    }

    if (deposit.status !== "pending") {
      console.log("Deposit already processed, status:", deposit.status)
      return NextResponse.json({ error: "Deposit already processed" }, { status: 400 })
    }

    console.log("Updating deposit status to approved")
    const { error: updateError } = await supabase
      .from("deposits")
      .update({
        status: "approved",
        admin_id: adminId,
        admin_notes: notes,
        reviewed_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (updateError) {
      console.error("Error updating deposit:", updateError)
      return NextResponse.json(
        {
          error: "Failed to approve deposit",
          details: updateError.message,
        },
        { status: 500 },
      )
    }

    console.log("Incrementing user balance:", deposit.user_id, deposit.amount, deposit.currency)
    // Update user balance
    const { error: balanceError } = await supabase.rpc("increment_balance", {
      p_user_id: deposit.user_id,
      p_amount: deposit.amount,
      p_currency: deposit.currency,
    })

    if (balanceError) {
      console.error("Error updating balance:", balanceError)
      // Rollback deposit status
      console.log("Rolling back deposit status")
      await supabase.from("deposits").update({ status: "pending" }).eq("id", params.id)
      return NextResponse.json(
        {
          error: "Failed to update balance",
          details: balanceError.message,
        },
        { status: 500 },
      )
    }

    console.log("Deposit approved successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error approving deposit:", error)
    return NextResponse.json(
      {
        error: "Failed to approve deposit",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
