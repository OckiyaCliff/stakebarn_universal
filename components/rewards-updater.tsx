"use client"

import { useEffect } from "react"

export function RewardsUpdater() {
  useEffect(() => {
    // Calculate rewards on component mount
    const calculateRewards = async () => {
      try {
        await fetch("/api/calculate-rewards", { method: "POST" })
      } catch (error) {
        console.error("Failed to calculate rewards:", error)
      }
    }

    calculateRewards()

    // Set up interval to calculate rewards every 5 minutes
    const interval = setInterval(calculateRewards, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return null
}
