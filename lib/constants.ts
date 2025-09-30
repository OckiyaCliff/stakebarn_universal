// Platform wallet addresses for deposits
export const PLATFORM_WALLETS = {
  ETH: "0xfDbf3bF85De18E9Ee89aFeBE47700A6f5D646F56",
  BTC: "bc1qn6ck4mvkajcmhx7vevaun0xtwedh6pplxnytqz",
  SOL: "8XXzMXfBaDYDJbFuTFYDionENmzXWziBJHzbvCbvyZhe",
  XRP: "rwHrXoJDz5HsrnJZo72RdxNH9oFsyDoCDG",
} as const

export type Currency = keyof typeof PLATFORM_WALLETS

export const CURRENCY_INFO = {
  ETH: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  BTC: { name: "Bitcoin", symbol: "BTC", decimals: 8 },
  SOL: { name: "Solana", symbol: "SOL", decimals: 9 },
  XRP: { name: "Ripple", symbol: "XRP", decimals: 6 },
} as const
