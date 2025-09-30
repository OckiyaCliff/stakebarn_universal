/**
 * Calculate rewards for a stake based on time elapsed
 * Formula: (amount * apy / 100) * (days_elapsed / 365)
 */
export function calculateRewards(amount: number, apy: number, startDate: Date, endDate?: Date): number {
  const now = endDate || new Date()
  const daysElapsed = Math.max(0, (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate rewards: (amount * APY%) * (days / 365)
  const annualReward = (amount * apy) / 100
  const rewards = annualReward * (daysElapsed / 365)

  return rewards
}

/**
 * Calculate daily rewards for a stake
 */
export function calculateDailyRewards(amount: number, apy: number): number {
  return (amount * apy) / 100 / 365
}

/**
 * Calculate estimated rewards for a given period
 */
export function calculateEstimatedRewards(amount: number, apy: number, days: number): number {
  const annualReward = (amount * apy) / 100
  return annualReward * (days / 365)
}
