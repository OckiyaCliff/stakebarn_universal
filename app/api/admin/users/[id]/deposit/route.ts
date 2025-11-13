import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { checkIsAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAdmin, adminId } = await checkIsAdmin()
    console.log("Admin create deposit for user - isAdmin:", isAdmin, "userId:", params.id)

    if (!isAdmin || !adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currency, amount, tx_hash, wallet_address, notes, auto_approve } = await request.json()
    console.log("Deposit creation request:", { currency, amount, tx_hash, wallet_address, auto_approve })

    const supabase = getAdminClient()

    // Validate inputs
    if (!currency || !amount || amount <= 0) {
      return NextResponse.json({ error: "Currency and valid amount are required" }, { status: 400 })
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("id", params.id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create deposit record
    const depositData: any = {
      user_id: params.id,
      currency,
      amount: Number.parseFloat(amount),
      tx_hash: tx_hash || null,
      wallet_address: wallet_address || null,
      status: auto_approve ? "approved" : "pending",
      admin_id: adminId,
      admin_notes: notes || `Deposit created by admin${notes ? `: ${notes}` : ""}`,
      reviewed_at: auto_approve ? new Date().toISOString() : null,
      confirmed_at: auto_approve ? new Date().toISOString() : null,
    }

    const { data: deposit, error: depositError } = await supabase
      .from("deposits")
      .insert(depositData)
      .select()
      .single()

    if (depositError) {
      console.error("Error creating deposit:", depositError)
      return NextResponse.json({ error: "Failed to create deposit", details: depositError.message }, { status: 500 })
    }

    // If auto_approve is true, also update the user's balance
    if (auto_approve) {
      console.log("Auto-approving deposit, updating balance")
      const { error: balanceError } = await supabase.rpc("increment_balance", {
        p_user_id: params.id,
        p_amount: Number.parseFloat(amount),
        p_currency: currency,
      })

      if (balanceError) {
        console.error("Error updating balance:", balanceError)
        // Rollback deposit creation
        await supabase.from("deposits").delete().eq("id", deposit.id)
        return NextResponse.json(
          { error: "Failed to update balance", details: balanceError.message },
          { status: 500 },
        )
      }
    }

    console.log("Deposit created successfully for user:", params.id)
    return NextResponse.json({
      success: true,
      deposit: {
        id: deposit.id,
        amount: deposit.amount,
        currency: deposit.currency,
        status: deposit.status,
      },
    })
  } catch (error) {
    console.error("Error in admin deposit creation:", error)
    return NextResponse.json(
      {
        error: "Failed to create deposit",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

