import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { checkIsAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    console.log("Checking admin authentication for users")
    const isAdmin = await checkIsAdmin()
    if (!isAdmin) {
      console.log("Admin check failed - not authorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.log("Admin authenticated successfully")

    const supabase = getAdminClient()
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    console.log("Fetching users - page:", page, "limit:", limit)

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
      return NextResponse.json({ error: profilesError.message }, { status: 500 })
    }

    // Fetch balances for all users
    const userIds = profiles?.map((p) => p.id) || []
    const { data: balances, error: balancesError } = await supabase.from("balances").select("*").in("user_id", userIds)

    if (balancesError) {
      console.error("Error fetching balances:", balancesError)
      return NextResponse.json({ error: balancesError.message }, { status: 500 })
    }

    // Combine profiles with their balances
    const users = profiles?.map((profile) => ({
      ...profile,
      balances: balances?.filter((b) => b.user_id === profile.id) || [],
    }))

    console.log("Successfully fetched users:", users?.length || 0)

    // Get total count
    const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true })

    return NextResponse.json({ users, total: count, page, limit })
  } catch (error) {
    console.error("Error in users GET:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
