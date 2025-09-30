import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id } = await params

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

    const body = await request.json()
    const { notes } = body

    if (!notes || !notes.trim()) {
      return NextResponse.json({ error: "Notes are required for rejection" }, { status: 400 })
    }

    // Update withdrawal status
    const { error: updateError } = await supabase
      .from("withdrawals")
      .update({
        status: "rejected",
        admin_id: admin.id,
        admin_notes: notes,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error rejecting withdrawal:", error)
    return NextResponse.json({ error: "Failed to reject withdrawal" }, { status: 500 })
  }
}
