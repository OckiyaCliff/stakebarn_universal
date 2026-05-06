// =============================================================================
// StakeBarn Universal — Asset Registry
// =============================================================================
// Central configuration for all supported tokens. Add new tokens here without
// schema changes — the UI, price fetching, and swap logic all derive from this.

export type AssetType = "staking" | "earn" | "hold"

export interface AssetConfig {
  name: string
  symbol: string
  decimals: number
  type: AssetType
  wallet: string
  network?: string
  icon: string
  color: string          // Tailwind gradient class for balance cards
  borderColor: string    // Border accent color
  coingeckoId: string
  description: string
}

export const ASSETS: Record<string, AssetConfig> = {
  // ── Staking Assets (Proof-of-Stake) ─────────────────────────────────────
  ETH: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    type: "staking",
    wallet: "0xfDbf3bF85De18E9Ee89aFeBE47700A6f5D646F56",
    network: "ERC-20",
    icon: "Ξ",
    color: "from-blue-500/15 to-blue-500/5",
    borderColor: "border-blue-500/20",
    coingeckoId: "ethereum",
    description: "Proof-of-Stake",
  },
  SOL: {
    name: "Solana",
    symbol: "SOL",
    decimals: 9,
    type: "staking",
    wallet: "8XXzMXfBaDYDJbFuTFYDionENmzXWziBJHzbvCbvyZhe",
    network: "Solana",
    icon: "◎",
    color: "from-purple-500/15 to-purple-500/5",
    borderColor: "border-purple-500/20",
    coingeckoId: "solana",
    description: "Proof-of-Stake",
  },
  ATOM: {
    name: "Cosmos",
    symbol: "ATOM",
    decimals: 6,
    type: "staking",
    wallet: "cosmos1vtff0z387jvcj9u0ppwcpn8h46gglvd3tu2f4n",
    network: "Cosmos Hub",
    icon: "⚛",
    color: "from-indigo-500/15 to-indigo-500/5",
    borderColor: "border-indigo-500/20",
    coingeckoId: "cosmos",
    description: "Proof-of-Stake",
  },
  DOT: {
    name: "Polkadot",
    symbol: "DOT",
    decimals: 10,
    type: "staking",
    wallet: "12F1ZCCFBCdbd2iScXQ89pvvjvQdhPQWEUNG4jvezf695kHM",
    network: "Polkadot",
    icon: "●",
    color: "from-pink-500/15 to-pink-500/5",
    borderColor: "border-pink-500/20",
    coingeckoId: "polkadot",
    description: "Proof-of-Stake",
  },
  AVAX: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
    type: "staking",
    wallet: "0x96A1816a8E0Ac0c0e5a148AE6225f5144D5baf10",
    network: "C-Chain",
    icon: "▲",
    color: "from-red-500/15 to-red-500/5",
    borderColor: "border-red-500/20",
    coingeckoId: "avalanche-2",
    description: "Proof-of-Stake",
  },
  XRP: {
    name: "Ripple",
    symbol: "XRP",
    decimals: 6,
    type: "staking",
    wallet: "rwHrXoJDz5HsrnJZo72RdxNH9oFsyDoCDG",
    network: "XRPL",
    icon: "✕",
    color: "from-gray-400/15 to-gray-400/5",
    borderColor: "border-gray-400/20",
    coingeckoId: "ripple",
    description: "Proof-of-Stake",
  },

  // ── Earn Assets (Yield Products) ────────────────────────────────────────
  XLM: {
    name: "Stellar",
    symbol: "XLM",
    decimals: 7,
    type: "earn",
    wallet: "GBHMCJ3FKGWQBVNIF6JYSPBYMP22QSACSCWI33EP2BOS5VMUT5E6A7JE",
    network: "Stellar",
    icon: "✦",
    color: "from-sky-500/15 to-sky-500/5",
    borderColor: "border-sky-500/20",
    coingeckoId: "stellar",
    description: "Yield Product",
  },
  USDT: {
    name: "Tether",
    symbol: "USDT",
    decimals: 6,
    type: "earn",
    wallet: "0x96A1816a8E0Ac0c0e5a148AE6225f5144D5baf10",
    network: "ERC-20",
    icon: "₮",
    color: "from-emerald-500/15 to-emerald-500/5",
    borderColor: "border-emerald-500/20",
    coingeckoId: "tether",
    description: "Yield Product",
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    type: "earn",
    wallet: "0x96A1816a8E0Ac0c0e5a148AE6225f5144D5baf10",
    network: "ERC-20",
    icon: "$",
    color: "from-blue-400/15 to-blue-400/5",
    borderColor: "border-blue-400/20",
    coingeckoId: "usd-coin",
    description: "Yield Product",
  },

  // ── Hold Assets (Deposit & Store only) ──────────────────────────────────
  BTC: {
    name: "Bitcoin",
    symbol: "BTC",
    decimals: 8,
    type: "hold",
    wallet: "bc1qn6ck4mvkajcmhx7vevaun0xtwedh6pplxnytqz",
    network: "Bitcoin",
    icon: "₿",
    color: "from-orange-500/15 to-orange-500/5",
    borderColor: "border-orange-500/20",
    coingeckoId: "bitcoin",
    description: "Store of Value",
  },
}

// ── Derived Helpers ─────────────────────────────────────────────────────────
export const STAKING_ASSETS = Object.entries(ASSETS)
  .filter(([, a]) => a.type === "staking")
  .map(([k]) => k)

export const EARN_ASSETS = Object.entries(ASSETS)
  .filter(([, a]) => a.type === "earn")
  .map(([k]) => k)

export const HOLD_ASSETS = Object.entries(ASSETS)
  .filter(([, a]) => a.type === "hold")
  .map(([k]) => k)

export const DEPOSITABLE_ASSETS = Object.entries(ASSETS).map(([k]) => k)

export const EARNABLE_ASSETS = [...STAKING_ASSETS, ...EARN_ASSETS]

export const ALL_CURRENCIES = Object.keys(ASSETS)

export type Currency = keyof typeof ASSETS

// ── Legacy Compatibility ────────────────────────────────────────────────────
export const PLATFORM_WALLETS = Object.fromEntries(
  Object.entries(ASSETS).map(([k, v]) => [k, v.wallet])
) as Record<string, string>

export const CURRENCY_INFO = Object.fromEntries(
  Object.entries(ASSETS).map(([k, v]) => [k, { name: v.name, symbol: v.symbol, decimals: v.decimals }])
) as Record<string, { name: string; symbol: string; decimals: number }>

// Swap fee percentage (1.5%)
export const SWAP_FEE_PERCENT = 0.015

// Signup bonus amount in USD
export const SIGNUP_BONUS_USD = 15
