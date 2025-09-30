import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/admin-auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const { depositId } = await request.json()
    const adminClient = createAdminClient()

    // Get deposit details
    const { data: deposit, error: depositError } = await adminClient
      .from("deposits")
      .select("*")
      .eq("id", depositId)
      .single()

    if (depositError || !deposit) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 })
    }

    // Update deposit status
    const { error: updateError } = await adminClient
      .from("deposits")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", depositId)

    if (updateError) throw updateError

    // Update user balance
    const { data: existingBalance } = await adminClient
      .from("balances")
      .select("*")
      .eq("user_id", deposit.user_id)
      .eq("currency", deposit.currency)
      .single()

    if (existingBalance) {
      // Update existing balance
      const newBalance = Number(existingBalance.available_balance) + Number(deposit.amount)
      await adminClient
        .from("balances")
        .update({ available_balance: newBalance, updated_at: new Date().toISOString() })
        .eq("id", existingBalance.id)
    } else {
      // Create new balance
      await adminClient.from("balances").insert({
        user_id: deposit.user_id,
        currency: deposit.currency,
        available_balance: deposit.amount,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error confirming deposit:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
