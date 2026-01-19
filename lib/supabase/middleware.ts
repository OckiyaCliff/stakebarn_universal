import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isAdminAuthRoute = request.nextUrl.pathname.startsWith("/admin/auth")

  const checkIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      const { data, error } = await adminClient.from("admins").select("id").eq("user_id", userId).single()

      return !error && !!data
    } catch {
      return false
    }
  }

  if (isAdminRoute && !isAdminAuthRoute) {
    // Check if user is authenticated and is an admin
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/auth/login"
      return NextResponse.redirect(url)
    }

    const isAdmin = await checkIsAdmin(user.id)

    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/auth/login"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  if (isAdminAuthRoute && user) {
    const isAdmin = await checkIsAdmin(user.id)

    if (isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/dashboard"
      return NextResponse.redirect(url)
    }
  }

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth",
    "/blog",
    "/about",
    "/privacy",
    "/terms",
    "/learn",
    "/resources",
  ]

  const isPublicRoute = publicRoutes.some(
    (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + "/")
  )

  // Redirect to login if not authenticated and trying to access protected routes
  if (!user && !isPublicRoute && !isAdminRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if authenticated and trying to access auth pages
  if (user && (request.nextUrl.pathname.startsWith("/auth") || request.nextUrl.pathname === "/")) {
    const isAdmin = await checkIsAdmin(user.id)

    const url = request.nextUrl.clone()
    url.pathname = isAdmin ? "/admin/dashboard" : "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
