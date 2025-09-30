import { NextResponse } from "next/server"
import { fetchCryptoPrices } from "@/lib/crypto-prices"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Cache for 60 seconds

export async function GET() {
  try {
    const prices = await fetchCryptoPrices()

    return NextResponse.json({
      success: true,
      prices,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in crypto prices API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch crypto prices",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
