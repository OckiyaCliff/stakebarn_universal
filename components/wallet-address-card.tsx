"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle2, Loader2, KeyRound } from "lucide-react"
import { useState, useEffect } from "react"
import { ASSETS, type Currency } from "@/lib/constants"
import { Skeleton } from "@/components/ui/skeleton"

interface WalletAddressCardProps {
  currency: Currency
  address: string
}

export function WalletAddressCard({ currency, address }: WalletAddressCardProps) {
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(true)

  // Simulate wallet generation time when currency changes
  useEffect(() => {
    setIsGenerating(true)
    const timer = setTimeout(() => {
      setIsGenerating(false)
    }, 2500) // 2.5 seconds generation animation
    return () => clearTimeout(timer)
  }, [currency])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const asset = ASSETS[currency]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {asset.icon} {asset.name} ({currency}) Deposit Address
        </CardTitle>
        <CardDescription>
          Send {currency} to this address via the <span className="font-semibold text-foreground">{asset.network}</span> network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-6 rounded-lg bg-muted/30 border border-dashed border-border/60">
            <div className="relative mb-3">
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                <KeyRound className="h-5 w-5 text-primary animate-pulse" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              Generating secure {currency} wallet address...
            </p>
            <div className="w-full max-w-[280px] mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%] mx-auto" />
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center gap-2">
              <div className={`flex-1 rounded-lg border ${asset.borderColor} bg-muted/20 p-4 font-mono text-sm break-all relative overflow-hidden group`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${asset.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <span className="relative z-10">{address}</span>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopy} 
                className={`shrink-0 h-14 w-14 border-${asset.borderColor} hover:bg-primary/10 transition-colors`}
              >
                {copied ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-primary mt-3 animate-in slide-in-from-top-1 fade-in">
                Address copied to clipboard!
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
