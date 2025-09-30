"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DepositActions({ deposit }: { deposit: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/deposits/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositId: deposit.id }),
      })

      if (!response.ok) throw new Error("Failed to confirm deposit")

      router.refresh()
    } catch (error) {
      console.error(" Error confirming deposit:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/deposits/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositId: deposit.id }),
      })

      if (!response.ok) throw new Error("Failed to reject deposit")

      router.refresh()
    } catch (error) {
      console.error(" Error rejecting deposit:", error)
    } finally {
      setLoading(false)
    }
  }

  if (deposit.status !== "pending") {
    return <span className="text-xs text-muted-foreground">No actions</span>
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="default" onClick={handleConfirm} disabled={loading}>
        <Check className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="destructive" onClick={handleReject} disabled={loading}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
