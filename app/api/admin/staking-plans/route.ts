import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { checkIsAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("Checking admin authentication for staking plans")
    const isAdmin = await checkIsAdmin()
    if (!isAdmin) {
      console.log("Admin check failed - not authorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.log("Admin authenticated successfully")

    const supabase = getAdminClient()

    console.log("Fetching staking plans")
    const { data: plans, error } = await supabase
      .from("staking_plans")
      .select("*")
      .order("lockup_days", { ascending: true })

    if (error) {
      console.error("Error fetching plans:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Successfully fetched plans:", plans?.length || 0)
    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Error in plans GET:", error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Checking admin authentication for creating plan")
    const isAdmin = await checkIsAdmin()
    if (!isAdmin) {
      console.log("Admin check failed - not authorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, apy, lockup_days, min_stake, currency } = await request.json()
    console.log("Creating new staking plan:", name)

    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from("staking_plans")
      .insert({
        name,
        apy,
        lockup_days,
        min_stake,
        currency,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating plan:", error)
      return NextResponse.json({ error: "Failed to create plan" }, { status: 500 })
    }

    console.log("Successfully created plan:", data.id)
    return NextResponse.json({ plan: data })
  } catch (error) {
    console.error("Error in plan POST:", error)
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 })
  }
}
