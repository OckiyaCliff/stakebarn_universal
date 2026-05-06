"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface SiteHeaderProps {
  variant?: "transparent" | "solid"
}

export function SiteHeader({ variant = "solid" }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isTransparent = variant === "transparent"

  return (
    <header
      className={`sticky top-0 z-50 w-full ${
        isTransparent
          ? "bg-transparent"
          : "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <nav
          className={`flex items-center justify-between rounded-full px-6 py-2.5 ${
            isTransparent
              ? "bg-white/5 backdrop-blur-xl border border-white/10"
              : "bg-card/50 backdrop-blur-xl border border-border/40"
          }`}
          aria-label="Global"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-xl font-bold text-foreground">StakeBarn</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Toggle menu</span>
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden lg:flex lg:gap-x-8">
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/learn"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Learn
            </Link>
            <Link
              href="/resources"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Resources
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full px-5">
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="mx-6 mt-2 rounded-2xl border border-border/40 bg-card/95 backdrop-blur-xl p-4 space-y-1">
            <Link
              href="/about"
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/learn"
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Learn
            </Link>
            <Link
              href="/resources"
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              href="/blog"
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="mt-3 pt-3 border-t border-border/40 space-y-2">
              <Button asChild variant="outline" className="w-full rounded-full bg-transparent border-border/40">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="w-full rounded-full">
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
