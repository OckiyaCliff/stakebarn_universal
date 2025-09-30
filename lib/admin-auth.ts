import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function checkIsAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const adminClient = createAdminClient()
  const { data, error } = await adminClient.from("admins").select("id").eq("user_id", user.id).single()

  return !error && !!data
}

export async function requireAdmin() {
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required")
  }
  return true
}
