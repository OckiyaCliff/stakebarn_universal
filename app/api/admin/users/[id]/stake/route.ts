import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { checkIsAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAdmin } = await checkIsAdmin()
    console.log("Admin stake for user - isAdmin:", isAdmin, "userId:", params.id)

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan_id, amount } = await request.json()
    console.log("Stake request:", { plan_id, amount })

    const supabase = getAdminClient()

    // Validate inputs
    if (!plan_id || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid plan_id or amount" }, { status: 400 })
    }

    // Fetch staking plan details
    const { data: plan, error: planError } = await supabase
      .from("staking_plans")
      .select("*")
      .eq("id", plan_id)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: "Staking plan not found" }, { status: 404 })
    }

    if (!plan.is_active) {
      return NextResponse.json({ error: "Staking plan is not active" }, { status: 400 })
    }

    // Check user's available balance
    const { data: balance, error: balanceError } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", params.id)
      .eq("currency", plan.currency)
      .single()

    if (balanceError || !balance) {
      return NextResponse.json(
        { error: `User does not have a ${plan.currency} balance. Please create one first.` },
        { status: 404 },
      )
    }

    const availableBalance = Number.parseFloat(balance.available_balance.toString())
    const minStake = Number.parseFloat(plan.min_stake.toString())

    // Validate amount
    if (amount < minStake) {
      return NextResponse.json({ error: `Minimum stake is ${minStake} ${plan.currency}` }, { status: 400 })
    }

    if (amount > availableBalance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Calculate end date if lockup period exists
    const endDate = plan.lockup_days > 0 ? new Date(Date.now() + plan.lockup_days * 24 * 60 * 60 * 1000).toISOString() : null

    // Create stake
    const { data: stake, error: stakeError } = await supabase
      .from("stakes")
      .insert({
        user_id: params.id,
        plan_id: plan.id,
        currency: plan.currency,
        amount: amount,
        apy: plan.apy,
        lockup_days: plan.lockup_days,
        end_date: endDate,
        status: "active",
      })
      .select()
      .single()

    if (stakeError) {
      console.error("Error creating stake:", stakeError)
      return NextResponse.json({ error: "Failed to create stake", details: stakeError.message }, { status: 500 })
    }

    // Update balances: move from available to staked
    const newAvailable = availableBalance - amount
    const newStaked = Number.parseFloat(balance.staked_balance.toString()) + amount

    const { error: updateError } = await supabase
      .from("balances")
      .update({
        available_balance: newAvailable,
        staked_balance: newStaked,
        updated_at: new Date().toISOString(),
      })
      .eq("id", balance.id)

    if (updateError) {
      console.error("Error updating balance:", updateError)
      // Rollback stake creation
      await supabase.from("stakes").delete().eq("id", stake.id)
      return NextResponse.json({ error: "Failed to update balance", details: updateError.message }, { status: 500 })
    }

    console.log("Stake created successfully for user:", params.id)
    return NextResponse.json({
      success: true,
      stake: {
        id: stake.id,
        amount: stake.amount,
        currency: stake.currency,
        apy: stake.apy,
      },
    })
  } catch (error) {
    console.error("Error in admin stake:", error)
    return NextResponse.json(
      {
        error: "Failed to create stake",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

