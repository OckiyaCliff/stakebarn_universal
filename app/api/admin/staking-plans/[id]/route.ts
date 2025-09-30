import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { checkIsAdmin } from "@/lib/admin-auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminCheck = await checkIsAdmin()
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, apy, lockup_days, min_stake, is_active } = await request.json()
    const supabase = getAdminClient()

    const { error } = await supabase
      .from("staking_plans")
      .update({
        name,
        apy,
        lockup_days,
        min_stake,
        is_active,
      })
      .eq("id", params.id)

    if (error) {
      console.error("Error updating plan:", error)
      return NextResponse.json({ error: "Failed to update plan" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in plan PUT:", error)
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminCheck = await checkIsAdmin()
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = getAdminClient()

    // Check if plan has active stakes
    const { count } = await supabase
      .from("stakes")
      .select("*", { count: "exact", head: true })
      .eq("plan_id", params.id)
      .eq("status", "active")

    if (count && count > 0) {
      return NextResponse.json({ error: "Cannot delete plan with active stakes" }, { status: 400 })
    }

    const { error } = await supabase.from("staking_plans").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting plan:", error)
      return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in plan DELETE:", error)
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 })
  }
}
