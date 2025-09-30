import { type NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { checkIsAdmin } from "@/lib/admin-auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isAdmin, adminId } = await checkIsAdmin()
    console.log("Decline deposit - isAdmin:", isAdmin, "adminId:", adminId)

    if (!isAdmin || !adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { notes } = await request.json()
    const supabase = getAdminClient()

    console.log("Fetching deposit:", params.id)
    // Get deposit details
    const { data: deposit, error: depositError } = await supabase
      .from("deposits")
      .select("*")
      .eq("id", params.id)
      .single()

    if (depositError || !deposit) {
      console.error("Deposit not found:", depositError)
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 })
    }

    if (deposit.status !== "pending") {
      console.log("Deposit already processed, status:", deposit.status)
      return NextResponse.json({ error: "Deposit already processed" }, { status: 400 })
    }

    console.log("Updating deposit status to declined")
    const { error: updateError } = await supabase
      .from("deposits")
      .update({
        status: "declined",
        admin_id: adminId,
        admin_notes: notes || "Declined by admin",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (updateError) {
      console.error("Error updating deposit:", updateError)
      return NextResponse.json(
        {
          error: "Failed to decline deposit",
          details: updateError.message,
        },
        { status: 500 },
      )
    }

    console.log("Deposit declined successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error declining deposit:", error)
    return NextResponse.json(
      {
        error: "Failed to decline deposit",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
