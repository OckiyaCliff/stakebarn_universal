import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { SIGNUP_BONUS_USD } from "@/lib/constants"
import { fetchCryptoPrices } from "@/lib/crypto-prices"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already received bonus
    const { data: existingBonus } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", user.id)
      .eq("currency", "ETH")
      .single()

    // Check profile for bonus flag
    const { data: profile } = await supabase
      .from("profiles")
      .select("bonus_claimed")
      .eq("id", user.id)
      .single()

    if (profile?.bonus_claimed) {
      return NextResponse.json({ error: "Bonus already claimed" }, { status: 400 })
    }

    // Get live ETH price to calculate bonus amount in ETH
    const prices = await fetchCryptoPrices()
    const ethPrice = prices["eth"] || 3500
    const bonusAmountETH = SIGNUP_BONUS_USD / ethPrice

    if (existingBonus) {
      // Add bonus to existing ETH balance
      const newBalance = parseFloat(existingBonus.available_balance.toString()) + bonusAmountETH
      await supabase
        .from("balances")
        .update({
          available_balance: newBalance,
          bonus_balance: bonusAmountETH,
        })
        .eq("user_id", user.id)
        .eq("currency", "ETH")
    } else {
      // Create ETH balance with bonus
      await supabase.from("balances").insert({
        user_id: user.id,
        currency: "ETH",
        available_balance: bonusAmountETH,
        staked_balance: 0,
        total_rewards: 0,
        bonus_balance: bonusAmountETH,
      })
    }

    // Mark bonus as claimed in profile
    await supabase
      .from("profiles")
      .update({ bonus_claimed: true })
      .eq("id", user.id)

    return NextResponse.json({
      success: true,
      bonus: {
        amount: bonusAmountETH,
        currency: "ETH",
        usdValue: SIGNUP_BONUS_USD,
      },
    })
  } catch (error) {
    console.error("Signup bonus error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
