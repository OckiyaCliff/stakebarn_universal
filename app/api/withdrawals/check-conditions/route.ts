import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify admin secret key for cron job
    const authHeader = request.headers.get("authorization")
    const adminSecret = process.env.ADMIN_SECRET_KEY

    if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all approved withdrawals with conditions that haven't been processed
    const { data: withdrawals, error } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("status", "approved")
      .neq("approval_condition", "none")
      .eq("condition_met", false)

    if (error) throw error

    if (!withdrawals || withdrawals.length === 0) {
      return NextResponse.json({ message: "No withdrawals to check", processed: 0 })
    }

    let processedCount = 0

    // Check each withdrawal's condition
    for (const withdrawal of withdrawals) {
      try {
        // Check if condition is now met
        const { data: conditionMet } = await supabase.rpc("check_withdrawal_conditions", {
          p_user_id: withdrawal.user_id,
          p_condition: withdrawal.approval_condition,
        })

        if (conditionMet) {
          // Update condition_met status
          await supabase
            .from("withdrawals")
            .update({
              condition_met: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", withdrawal.id)

          // Process the withdrawal
          const { error: processError } = await supabase.rpc("process_withdrawal", {
            p_withdrawal_id: withdrawal.id,
          })

          if (!processError) {
            processedCount++
          } else {
            console.error(`Error processing withdrawal ${withdrawal.id}:`, processError)
          }
        }
      } catch (err) {
        console.error(`Error checking withdrawal ${withdrawal.id}:`, err)
      }
    }

    return NextResponse.json({
      message: "Withdrawal conditions checked",
      total: withdrawals.length,
      processed: processedCount,
    })
  } catch (error) {
    console.error("Error checking withdrawal conditions:", error)
    return NextResponse.json({ error: "Failed to check withdrawal conditions" }, { status: 500 })
  }
}
