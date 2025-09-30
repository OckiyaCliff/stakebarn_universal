import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { checkIsAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    console.log("Checking admin authentication for stakes")
    const isAdmin = await checkIsAdmin()
    if (!isAdmin) {
      console.log("Admin check failed - not authorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.log("Admin authenticated successfully")

    const supabase = getAdminClient()
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") || "active"

    console.log("Fetching stakes with status:", status)

    const { data: stakes, error: stakesError } = await supabase
      .from("stakes")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (stakesError) {
      console.error("Error fetching stakes:", stakesError)
      return NextResponse.json({ error: stakesError.message }, { status: 500 })
    }

    // Fetch user profiles
    const userIds = stakes?.map((s) => s.user_id) || []
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", userIds)

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
    }

    // Fetch staking plans
    const planIds = stakes?.map((s) => s.plan_id) || []
    const { data: plans, error: plansError } = await supabase
      .from("staking_plans")
      .select("id, name, apy")
      .in("id", planIds)

    if (plansError) {
      console.error("Error fetching plans:", plansError)
    }

    // Combine stakes with user and plan info
    const stakesWithDetails = stakes?.map((stake) => ({
      ...stake,
      profiles: profiles?.find((p) => p.id === stake.user_id) || null,
      staking_plans: plans?.find((p) => p.id === stake.plan_id) || null,
    }))

    console.log("Successfully fetched stakes:", stakesWithDetails?.length || 0)
    return NextResponse.json({ stakes: stakesWithDetails })
  } catch (error) {
    console.error("Error in stakes GET:", error)
    return NextResponse.json({ error: "Failed to fetch stakes" }, { status: 500 })
  }
}
