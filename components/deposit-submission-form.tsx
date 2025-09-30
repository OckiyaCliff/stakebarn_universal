"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CURRENCY_INFO, type Currency } from "@/lib/constants"
import { Upload, CheckCircle2, AlertCircle } from "lucide-react"

export function DepositSubmissionForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    currency: "ETH" as Currency,
    amount: "",
    tx_hash: "",
    wallet_address: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed")
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const submitData = new FormData()
      submitData.append("currency", formData.currency)
      submitData.append("amount", formData.amount)
      if (formData.tx_hash) submitData.append("tx_hash", formData.tx_hash)
      if (formData.wallet_address) submitData.append("wallet_address", formData.wallet_address)
      if (selectedFile) submitData.append("proof_image", selectedFile)

      const response = await fetch("/api/deposits", {
        method: "POST",
        body: submitData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit deposit")
      }

      setSuccess(true)
      setFormData({
        currency: "ETH",
        amount: "",
        tx_hash: "",
        wallet_address: "",
      })
      setSelectedFile(null)

      // Reset form and refresh after 2 seconds
      setTimeout(() => {
        setSuccess(false)
        router.refresh()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit deposit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Your Deposit</CardTitle>
        <CardDescription>
          After sending crypto to the wallet address above, submit your deposit details for verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4 border-primary bg-primary/10">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              Deposit submitted successfully! Your deposit is pending admin approval.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-4 border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => setFormData({ ...formData, currency: value as Currency })}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CURRENCY_INFO) as Currency[]).map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {CURRENCY_INFO[currency].name} ({currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx_hash">Transaction Hash (Optional)</Label>
            <Input
              id="tx_hash"
              type="text"
              placeholder="0x..."
              value={formData.tx_hash}
              onChange={(e) => setFormData({ ...formData, tx_hash: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              The transaction hash from your wallet or exchange (helps speed up verification)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet_address">Your Wallet Address (Optional)</Label>
            <Input
              id="wallet_address"
              type="text"
              placeholder="Your sending wallet address"
              value={formData.wallet_address}
              onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proof_image">Proof of Payment (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="proof_image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {selectedFile && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a screenshot or receipt of your transaction (max 5MB, images only)
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !formData.amount}>
            {loading ? "Submitting..." : "Submit Deposit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
