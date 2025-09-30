import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { checkIsAdmin } from "@/lib/admin-auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAdmin } = await checkIsAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reason } = await request.json()
    const supabase = getAdminClient()

    // Get stake details
    const { data: stake, error: stakeError } = await supabase.from("stakes").select("*").eq("id", params.id).single()

    if (stakeError || !stake) {
      return NextResponse.json({ error: "Stake not found" }, { status: 404 })
    }

    if (stake.status !== "active") {
      return NextResponse.json({ error: "Stake is not active" }, { status: 400 })
    }

    // Update stake status to cancelled
    const { error: updateError } = await supabase
      .from("stakes")
      .update({
        status: "cancelled",
        end_date: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (updateError) {
      console.error("Error cancelling stake:", updateError)
      return NextResponse.json({ error: "Failed to cancel stake" }, { status: 500 })
    }

    // Return staked amount to user's available balance
    const { error: balanceError } = await supabase.rpc("return_staked_amount", {
      p_user_id: stake.user_id,
      p_amount: stake.amount,
      p_currency: stake.currency,
    })

    if (balanceError) {
      console.error("Error returning balance:", balanceError)
      // Rollback stake status
      await supabase.from("stakes").update({ status: "active" }).eq("id", params.id)
      return NextResponse.json({ error: "Failed to return balance" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error cancelling stake:", error)
    return NextResponse.json({ error: "Failed to cancel stake" }, { status: 500 })
  }
}
