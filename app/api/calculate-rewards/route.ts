import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()

  try {
    // Call the database function to calculate rewards
    const { error: rewardsError } = await supabase.rpc("calculate_stake_rewards")

    if (rewardsError) throw rewardsError

    // Call the function to complete expired stakes
    const { error: expiredError } = await supabase.rpc("complete_expired_stakes")

    if (expiredError) throw expiredError

    return NextResponse.json({ success: true, message: "Rewards calculated successfully" })
  } catch (error) {
    console.error("Error calculating rewards:", error)
    return NextResponse.json({ success: false, error: "Failed to calculate rewards" }, { status: 500 })
  }
}
