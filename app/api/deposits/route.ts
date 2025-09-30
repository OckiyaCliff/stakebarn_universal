import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const currency = formData.get("currency") as string
    const amount = formData.get("amount") as string
    const txHash = formData.get("tx_hash") as string | null
    const walletAddress = formData.get("wallet_address") as string | null
    const proofImage = formData.get("proof_image") as File | null

    // Validate required fields
    if (!currency || !amount) {
      return NextResponse.json({ error: "Currency and amount are required" }, { status: 400 })
    }

    let proofImageUrl: string | null = null

    // Upload proof image if provided
    if (proofImage && proofImage.size > 0) {
      const fileExt = proofImage.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("deposit-proofs")
        .upload(fileName, proofImage, {
          contentType: proofImage.type,
          upsert: false,
        })

      if (uploadError) {
        console.error("Error uploading proof image:", uploadError)
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("deposit-proofs").getPublicUrl(uploadData.path)
        proofImageUrl = publicUrl
      }
    }

    // Insert deposit record
    const { data: deposit, error: insertError } = await supabase
      .from("deposits")
      .insert({
        user_id: user.id,
        currency,
        amount: Number.parseFloat(amount),
        tx_hash: txHash || null,
        wallet_address: walletAddress || null,
        proof_image_url: proofImageUrl,
        status: "pending",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating deposit:", insertError)
      return NextResponse.json({ error: "Failed to create deposit" }, { status: 500 })
    }

    return NextResponse.json({ success: true, deposit })
  } catch (error) {
    console.error("Error in deposit submission:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
