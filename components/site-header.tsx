"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-primary">StakeBarn</span>
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
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          <Link
            href="/about"
            className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/learn"
            className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            Learn
          </Link>
          <Link
            href="/resources"
            className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            Resources
          </Link>
          <Link
            href="/blog"
            className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
          >
            Blog
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button asChild variant="ghost">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-6 pb-6 pt-2">
            <Link
              href="/about"
              className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/learn"
              className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Learn
            </Link>
            <Link
              href="/resources"
              className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              href="/blog"
              className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="mt-4 space-y-2">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
