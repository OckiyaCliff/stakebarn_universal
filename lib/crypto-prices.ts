// Crypto price utilities using CoinGecko API

export type CryptoCurrency = "BTC" | "ETH" | "SOL" | "XRP" | "USDT" | "USDC"

// Map our currency symbols to CoinGecko IDs
const COINGECKO_IDS: Record<CryptoCurrency, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  USDT: "tether",
  USDC: "usd-coin",
}

export interface CryptoPrices {
  [key: string]: number
}

/**
 * Fetch current crypto prices from CoinGecko API
 * Returns prices in USD
 */
export async function fetchCryptoPrices(): Promise<CryptoPrices> {
  try {
    const ids = Object.values(COINGECKO_IDS).join(",")
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // Convert CoinGecko IDs back to our currency symbols
    const prices: CryptoPrices = {}
    for (const [symbol, id] of Object.entries(COINGECKO_IDS)) {
      prices[symbol.toLowerCase()] = data[id]?.usd || 0
    }

    return prices
  } catch (error) {
    console.error("Error fetching crypto prices:", error)
    // Return fallback prices if API fails
    return {
      btc: 95000,
      eth: 3500,
      sol: 180,
      xrp: 2.5,
      usdt: 1,
      usdc: 1,
    }
  }
}

export const getCryptoPrices = fetchCryptoPrices

/**
 * Convert crypto amount to USD
 */
export function convertToUSD(amount: number, currency: string, prices: CryptoPrices): number {
  const price = prices[currency] || 0
  return amount * price
}

/**
 * Format USD amount with proper decimals
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
