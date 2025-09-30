import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    const adminClient = createAdminClient()

    // Check if user is admin using service role (bypasses RLS)
    const { data: adminData, error: adminError } = await adminClient
      .from("admins")
      .select("id, email")
      .eq("user_id", userId)
      .single()

    if (adminError || !adminData) {
      return NextResponse.json({ isAdmin: false }, { status: 200 })
    }

    return NextResponse.json({ isAdmin: true, admin: adminData }, { status: 200 })
  } catch (error: any) {
    console.error("Error checking admin status:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
