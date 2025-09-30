import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

// Secret key for creating admin accounts (should be set as environment variable)
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "stakebarn-admin-secret-2024"

export async function POST(request: Request) {
  try {
    console.log(" Admin create route called")

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error(" Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { email, password, secretKey } = body

    console.log(" Creating admin account for:", email)

    // Verify secret key
    if (secretKey !== ADMIN_SECRET_KEY) {
      console.log(" Invalid secret key provided")
      return NextResponse.json({ error: "Invalid secret key" }, { status: 403 })
    }

    const adminClient = createAdminClient()

    // Create auth user
    console.log(" Creating auth user...")
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error(" Auth error:", authError)
      throw authError
    }

    console.log(" Auth user created:", authData.user.id)

    // Add to admins table
    console.log(" Adding to admins table...")
    const { error: adminError } = await adminClient.from("admins").insert({
      user_id: authData.user.id,
      email,
    })

    if (adminError) {
      console.error(" Admin table error:", adminError)
      throw adminError
    }

    console.log(" Admin account created successfully")
    return NextResponse.json({ success: true, message: "Admin account created successfully" })
  } catch (error: any) {
    console.error(" Error creating admin:", error)
    return NextResponse.json({ error: error.message || "Failed to create admin account" }, { status: 500 })
  }
}
