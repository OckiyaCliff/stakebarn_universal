"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { CheckCircle2, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const router = useRouter()

  // Verify the user has an active recovery session
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsValidSession(!!user)
    }
    checkSession()
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setIsSuccess(true)

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying your session...</p>
        </div>
      </div>
    )
  }

  // Invalid / expired session
  if (!isValidSession) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground">StakeBarn</h1>
            <p className="text-sm text-muted-foreground">Universal Staking Platform</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Session Expired</CardTitle>
              <CardDescription>
                This password reset link has expired or is invalid.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Password reset links are only valid for a limited time. Please request a new one.
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/forgot-password">Request New Reset Link</Link>
              </Button>
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">StakeBarn</h1>
          <p className="text-sm text-muted-foreground">Universal Staking Platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {isSuccess ? "Password Updated" : "Set New Password"}
            </CardTitle>
            <CardDescription>
              {isSuccess
                ? "Your password has been successfully updated"
                : "Enter your new password below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Your password has been changed. Redirecting you to the dashboard...
                  </p>
                  <div className="mt-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReset}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password match indicator */}
                  {confirmPassword && (
                    <div className="flex items-center gap-2 text-sm">
                      {password === confirmPassword ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-primary">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-destructive inline-block" />
                          <span className="text-destructive">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}

                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || password !== confirmPassword || password.length < 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
