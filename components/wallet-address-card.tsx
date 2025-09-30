"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { CURRENCY_INFO, type Currency } from "@/lib/constants"

interface WalletAddressCardProps {
  currency: Currency
  address: string
}

export function WalletAddressCard({ currency, address }: WalletAddressCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {CURRENCY_INFO[currency].name} ({currency}) Deposit Address
        </CardTitle>
        <CardDescription>Send {currency} to this address to deposit funds</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg bg-muted p-4 font-mono text-sm break-all">{address}</div>
          <Button variant="outline" size="icon" onClick={handleCopy} className="shrink-0 bg-transparent">
            {copied ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        {copied && <p className="text-sm text-primary">Address copied to clipboard!</p>}
      </CardContent>
    </Card>
  )
}
