"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { CURRENCY_INFO, PLATFORM_WALLETS, type Currency } from "@/lib/constants"

interface AdminDepositDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userEmail: string
  onSuccess?: () => void
}

export function AdminDepositDialog({ open, onOpenChange, userId, userEmail, onSuccess }: AdminDepositDialogProps) {
  const [currency, setCurrency] = useState<Currency>("ETH")
  const [amount, setAmount] = useState("")
  const [txHash, setTxHash] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [autoApprove, setAutoApprove] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/users/${userId}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency,
          amount: Number.parseFloat(amount),
          tx_hash: txHash || null,
          wallet_address: walletAddress || PLATFORM_WALLETS[currency],
          notes: notes || null,
          auto_approve: autoApprove,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Deposit ${autoApprove ? "created and approved" : "created"} successfully for ${userEmail}`,
        })
        onOpenChange(false)
        // Reset form
        setCurrency("ETH")
        setAmount("")
        setTxHash("")
        setWalletAddress("")
        setNotes("")
        setAutoApprove(true)
        if (onSuccess) {
          onSuccess()
        }
      } else {
        setError(data.error || "Failed to create deposit")
        toast({
          title: "Error",
          description: data.error || "Failed to create deposit",
          variant: "destructive",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create deposit"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Deposit for User</DialogTitle>
          <DialogDescription>Create a deposit on behalf of {userEmail}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(CURRENCY_INFO).map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {CURRENCY_INFO[curr as Currency].name} ({curr})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx_hash">Transaction Hash (Optional)</Label>
            <Input
              id="tx_hash"
              type="text"
              placeholder="0x..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet_address">Wallet Address (Optional)</Label>
            <Input
              id="wallet_address"
              type="text"
              placeholder={PLATFORM_WALLETS[currency]}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Default: {PLATFORM_WALLETS[currency]}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Admin Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this deposit..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto_approve"
              checked={autoApprove}
              onCheckedChange={(checked) => setAutoApprove(checked === true)}
            />
            <Label htmlFor="auto_approve" className="text-sm font-normal cursor-pointer">
              Auto-approve and credit balance immediately
            </Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !amount}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Deposit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

