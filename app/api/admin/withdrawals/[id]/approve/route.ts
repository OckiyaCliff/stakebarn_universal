import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: admin } = await supabase.from("admins").select("*").eq("user_id", user.id).single()

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { notes, approval_condition = "none" } = body

    // Check if the condition is met
    const { data: withdrawal } = await supabase.from("withdrawals").select("*, profiles(*)").eq("id", id).single()

    if (!withdrawal) {
      return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 })
    }

    // Check condition using the database function
    const { data: conditionResult } = await supabase.rpc("check_withdrawal_conditions", {
      p_user_id: withdrawal.user_id,
      p_condition: approval_condition,
    })

    // Update withdrawal status
    const { error: updateError } = await supabase
      .from("withdrawals")
      .update({
        status: "approved",
        approval_condition,
        condition_met: conditionResult || false,
        admin_id: admin.id,
        admin_notes: notes || null,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) throw updateError

    // If condition is "none" and met, process the withdrawal immediately
    if (approval_condition === "none") {
      const { error: processError } = await supabase.rpc("process_withdrawal", {
        p_withdrawal_id: id,
      })

      if (processError) {
        console.error("Error processing withdrawal:", processError)
        // Don't throw - withdrawal is approved but not processed yet
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error approving withdrawal:", error)
    return NextResponse.json({ error: "Failed to approve withdrawal" }, { status: 500 })
  }
}
