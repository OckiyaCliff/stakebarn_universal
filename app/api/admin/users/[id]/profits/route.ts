import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { checkIsAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAdmin } = await checkIsAdmin()
    console.log("Update profits - isAdmin:", isAdmin, "userId:", params.id)

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currency, total_rewards } = await request.json()
    console.log("Profits update request:", { currency, total_rewards })

    const supabase = getAdminClient()

    // Validate inputs
    if (!currency || total_rewards === undefined) {
      return NextResponse.json({ error: "Currency and total_rewards are required" }, { status: 400 })
    }

    if (total_rewards < 0) {
      return NextResponse.json({ error: "Total rewards cannot be negative" }, { status: 400 })
    }

    // Check if balance exists, create if not
    const { data: existingBalance, error: checkError } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", params.id)
      .eq("currency", currency)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error
      console.error("Error checking balance:", checkError)
      return NextResponse.json({ error: "Failed to check balance", details: checkError.message }, { status: 500 })
    }

    if (existingBalance) {
      // Update existing balance
      const { error: updateError } = await supabase
        .from("balances")
        .update({
          total_rewards: total_rewards,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingBalance.id)

      if (updateError) {
        console.error("Error updating profits:", updateError)
        return NextResponse.json(
          { error: "Failed to update profits", details: updateError.message },
          { status: 500 },
        )
      }
    } else {
      // Create new balance record with only total_rewards
      const { error: insertError } = await supabase.from("balances").insert({
        user_id: params.id,
        currency: currency,
        available_balance: 0,
        staked_balance: 0,
        total_rewards: total_rewards,
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Error creating balance:", insertError)
        return NextResponse.json(
          { error: "Failed to create balance", details: insertError.message },
          { status: 500 },
        )
      }
    }

    console.log("Profits updated successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in profits update:", error)
    return NextResponse.json(
      {
        error: "Failed to update profits",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

