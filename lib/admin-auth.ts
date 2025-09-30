import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function checkIsAdmin(): Promise<{ isAdmin: boolean; adminId: string | null }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("checkIsAdmin - user:", user?.id, user?.email)

  if (!user) {
    console.log("checkIsAdmin - no user found")
    return { isAdmin: false, adminId: null }
  }

  const adminClient = createAdminClient()
  const { data, error } = await adminClient.from("admins").select("id").eq("user_id", user.id).single()

  console.log("checkIsAdmin - admin query result:", { data, error })

  if (error || !data) {
    console.log("checkIsAdmin - user is not an admin")
    return { isAdmin: false, adminId: null }
  }

  console.log("checkIsAdmin - user is admin with id:", data.id)
  return { isAdmin: true, adminId: data.id }
}

export async function requireAdmin() {
  const { isAdmin } = await checkIsAdmin()
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required")
  }
  return true
}
