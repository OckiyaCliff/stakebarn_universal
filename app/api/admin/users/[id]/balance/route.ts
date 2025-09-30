import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { checkIsAdmin } from "@/lib/admin-auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAdmin } = await checkIsAdmin()
    console.log("Update balance - isAdmin:", isAdmin, "userId:", params.id)

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currency, available_balance, staked_balance } = await request.json()
    console.log("Balance update request:", { currency, available_balance, staked_balance })

    const supabase = getAdminClient()

    // Validate inputs
    if (!currency || available_balance === undefined || staked_balance === undefined) {
      console.error("Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (available_balance < 0 || staked_balance < 0) {
      console.error("Negative balance values")
      return NextResponse.json({ error: "Balances cannot be negative" }, { status: 400 })
    }

    console.log("Calling update_user_balance function")
    // Update balance using the function
    const { error } = await supabase.rpc("update_user_balance", {
      p_user_id: params.id,
      p_currency: currency,
      p_available_balance: available_balance,
      p_staked_balance: staked_balance,
    })

    if (error) {
      console.error("Error updating balance:", error)
      return NextResponse.json(
        {
          error: "Failed to update balance",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("Balance updated successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in balance update:", error)
    return NextResponse.json(
      {
        error: "Failed to update balance",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
