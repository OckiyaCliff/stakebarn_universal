import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const type = searchParams.get("type")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing sessions.
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data?.session) {
      let isRecovery = type === "recovery"

      // Fallback: Parse the JWT to check if authentication method was 'recovery'
      try {
        const token = data.session.access_token
        if (token) {
          const payloadBase64 = token.split(".")[1]
          const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8")
          const payload = JSON.parse(payloadJson)
          
          if (payload.amr && Array.isArray(payload.amr)) {
            isRecovery = isRecovery || payload.amr.some((m: any) => 
              m === "recovery" || (m && typeof m === "object" && m.method === "recovery")
            )
          }
        }
      } catch (e) {
        console.error("Error decoding session JWT:", e)
      }

      if (isRecovery) {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error?message=Could not authenticate`)
}
