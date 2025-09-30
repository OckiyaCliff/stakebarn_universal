import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's withdrawals with condition status
    const { data: withdrawals, error } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("user_id", user.id)
      .order("requested_at", { ascending: false })

    if (error) throw error

    // For each approved withdrawal with conditions, check if condition is met
    const withdrawalsWithStatus = await Promise.all(
      withdrawals.map(async (withdrawal) => {
        if (withdrawal.status === "approved" && withdrawal.approval_condition !== "none" && !withdrawal.condition_met) {
          // Check current condition status
          const { data: conditionMet } = await supabase.rpc("check_withdrawal_conditions", {
            p_user_id: user.id,
            p_condition: withdrawal.approval_condition,
          })

          return {
            ...withdrawal,
            current_condition_met: conditionMet || false,
          }
        }

        return withdrawal
      }),
    )

    return NextResponse.json({ withdrawals: withdrawalsWithStatus })
  } catch (error) {
    console.error("Error fetching withdrawal status:", error)
    return NextResponse.json({ error: "Failed to fetch withdrawal status" }, { status: 500 })
  }
}
