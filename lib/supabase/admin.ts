import { createClient } from "@supabase/supabase-js"

// Admin client with service role key for bypassing RLS
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export const getAdminClient = createAdminClient
