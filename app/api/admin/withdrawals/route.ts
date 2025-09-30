import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: admin } = await supabase.from("admins").select("*").eq("user_id", user.id).single()

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    // Get status from query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "pending"

    // Fetch withdrawals with user profiles
    const { data: withdrawals, error } = await supabase
      .from("withdrawals")
      .select(
        `
        *,
        profiles (
          email
        )
      `,
      )
      .eq("status", status)
      .order("requested_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ withdrawals })
  } catch (error) {
    console.error("Error fetching withdrawals:", error)
    return NextResponse.json({ error: "Failed to fetch withdrawals" }, { status: 500 })
  }
}
