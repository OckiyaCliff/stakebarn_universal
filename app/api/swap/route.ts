import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { SWAP_FEE_PERCENT } from "@/lib/constants"
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

    const body = await request.json()
    const { fromCurrency, toCurrency, amount } = body

    if (!fromCurrency || !toCurrency || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (fromCurrency === toCurrency) {
      return NextResponse.json({ error: "Cannot swap same currency" }, { status: 400 })
    }

    const swapAmount = parseFloat(amount)
    if (isNaN(swapAmount) || swapAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Fetch live prices
    const prices = await fetchCryptoPrices()
    const fromPrice = prices[fromCurrency.toLowerCase()]
    const toPrice = prices[toCurrency.toLowerCase()]

    if (!fromPrice || !toPrice) {
      return NextResponse.json({ error: "Unable to fetch prices" }, { status: 500 })
    }

    // Check user balance for source currency
    const { data: fromBalance } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", user.id)
      .eq("currency", fromCurrency)
      .single()

    if (!fromBalance) {
      return NextResponse.json({ error: `No ${fromCurrency} balance found` }, { status: 400 })
    }

    const availableBalance = parseFloat(fromBalance.available_balance.toString())
    if (availableBalance < swapAmount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Calculate conversion
    const usdValue = swapAmount * fromPrice
    const feeUsd = usdValue * SWAP_FEE_PERCENT
    const netUsdValue = usdValue - feeUsd
    const receivedAmount = netUsdValue / toPrice

    // Update source balance (deduct)
    const newFromBalance = availableBalance - swapAmount
    const { error: deductError } = await supabase
      .from("balances")
      .update({ available_balance: newFromBalance })
      .eq("user_id", user.id)
      .eq("currency", fromCurrency)

    if (deductError) {
      return NextResponse.json({ error: "Failed to deduct balance" }, { status: 500 })
    }

    // Update or create target balance (add)
    const { data: toBalance } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", user.id)
      .eq("currency", toCurrency)
      .single()

    if (toBalance) {
      const newToBalance = parseFloat(toBalance.available_balance.toString()) + receivedAmount
      const { error: addError } = await supabase
        .from("balances")
        .update({ available_balance: newToBalance })
        .eq("user_id", user.id)
        .eq("currency", toCurrency)

      if (addError) {
        // Rollback source deduction
        await supabase
          .from("balances")
          .update({ available_balance: availableBalance })
          .eq("user_id", user.id)
          .eq("currency", fromCurrency)
        return NextResponse.json({ error: "Failed to add balance" }, { status: 500 })
      }
    } else {
      const { error: createError } = await supabase
        .from("balances")
        .insert({
          user_id: user.id,
          currency: toCurrency,
          available_balance: receivedAmount,
          staked_balance: 0,
          total_rewards: 0,
        })

      if (createError) {
        // Rollback source deduction
        await supabase
          .from("balances")
          .update({ available_balance: availableBalance })
          .eq("user_id", user.id)
          .eq("currency", fromCurrency)
        return NextResponse.json({ error: "Failed to create balance" }, { status: 500 })
      }
    }

    // Record the swap in history
    await supabase.from("swaps").insert({
      user_id: user.id,
      from_currency: fromCurrency,
      to_currency: toCurrency,
      amount_sent: swapAmount,
      amount_received: receivedAmount,
      fee_usd: feeUsd,
      exchange_rate: fromPrice / toPrice,
    })

    return NextResponse.json({
      success: true,
      swap: {
        fromCurrency,
        toCurrency,
        amountSent: swapAmount,
        amountReceived: receivedAmount,
        fee: feeUsd,
        feePercent: SWAP_FEE_PERCENT * 100,
        exchangeRate: fromPrice / toPrice,
        usdValue,
      },
    })
  } catch (error) {
    console.error("Swap error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
