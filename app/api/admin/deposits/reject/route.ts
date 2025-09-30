import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/admin-auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const { depositId } = await request.json()
    const adminClient = createAdminClient()

    // Update deposit status to failed
    const { error } = await adminClient.from("deposits").update({ status: "failed" }).eq("id", depositId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error rejecting deposit:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
