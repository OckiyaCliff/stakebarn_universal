import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { checkIsAdmin } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    console.log("Checking admin authentication for deposits")
    const isAdmin = await checkIsAdmin()
    if (!isAdmin) {
      console.log("Admin check failed - not authorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.log("Admin authenticated successfully")

    const supabase = getAdminClient()
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") || "pending"

    console.log("Fetching deposits with status:", status)

    const { data: deposits, error: depositsError } = await supabase
      .from("deposits")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (depositsError) {
      console.error("Error fetching deposits:", depositsError)
      return NextResponse.json({ error: depositsError.message }, { status: 500 })
    }

    // Fetch user profiles for all deposits
    const userIds = deposits?.map((d) => d.user_id) || []
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", userIds)

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
      return NextResponse.json({ error: profilesError.message }, { status: 500 })
    }

    // Combine deposits with user email
    const depositsWithUsers = deposits?.map((deposit) => ({
      ...deposit,
      profiles: profiles?.find((p) => p.id === deposit.user_id) || null,
    }))

    console.log("Successfully fetched deposits:", depositsWithUsers?.length || 0)
    return NextResponse.json({ deposits: depositsWithUsers })
  } catch (error) {
    console.error("Error in deposits GET:", error)
    return NextResponse.json({ error: "Failed to fetch deposits" }, { status: 500 })
  }
}
