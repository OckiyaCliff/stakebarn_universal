import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getAdminClient()

    // Get user with all related data
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select(`
        *,
        balances (*),
        deposits (*),
        stakes (*)
      `)
      .eq("id", params.id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
