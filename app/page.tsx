import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight, Shield, TrendingUp, Lock, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Site Header Navigation */}
      <SiteHeader />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl text-balance">
              Stake your crypto.
              <span className="text-primary"> Earn rewards.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
              StakeBarn Universal offers secure, flexible staking for ETH, BTC,
              SOL, and XRP. Start earning passive income with competitive APYs
              and transparent rewards.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/auth/sign-up">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        id="features"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Choose StakeBarn?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Professional staking platform with competitive rates and flexible
            terms
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">
              High APY
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Earn up to 22% APY on your crypto holdings with our competitive
              staking plans
            </p>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">
              Secure
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your assets are protected with industry-leading security and
              blockchain verification
            </p>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">
              Flexible
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose between flexible or locked staking plans that fit your
              investment strategy
            </p>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-card-foreground">
              Transparent
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Real-time tracking of your deposits, stakes, and rewards with full
              transparency
            </p>
          </div>
        </div>
      </div>

      {/* Supported Currencies */}
      <div
        id="currencies"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Supported Cryptocurrencies
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { name: "Ethereum", symbol: "ETH", apy: "Up to 18%" },
            { name: "Bitcoin", symbol: "BTC", apy: "Up to 12%" },
            { name: "Solana", symbol: "SOL", apy: "Up to 22%" },
            { name: "Ripple", symbol: "XRP", apy: "Up to 16%" },
          ].map((currency) => (
            <div
              key={currency.symbol}
              className="rounded-lg border border-border bg-card p-6 text-center"
            >
              <div className="text-2xl font-bold text-card-foreground">
                {currency.symbol}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {currency.name}
              </div>
              <div className="mt-3 text-sm font-semibold text-primary">
                {currency.apy}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partners and Sponsors Section */}
      {/* <div id="partners" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Leading Exchanges
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our partners and backers include the world's top cryptocurrency platforms
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6 items-center">
          {[
            { name: "Binance", query: "binance_logo" },
            { name: "Coinbase", query: "coinbase logo" },
            { name: "KuCoin", query: "kucoin logo" },
            { name: "Kraken", query: "kraken exchange logo" },
            { name: "Crypto.com", query: "crypto.com logo" },
            { name: "Gemini", query: "gemini exchange logo" },
          ].map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center rounded-lg border border-border bg-card p-6 h-24 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={`/.?key=jr633&height=40&width=120&query=${encodeURIComponent(partner.query)}`}
                alt={partner.name}
                className="max-h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div> */}
      {/* Partners and Sponsors Section */}
      <div
        id="partners"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Leading Exchanges
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our partners and backers include the world's top cryptocurrency
            platforms
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6 items-center">
          {[
            { name: "Binance", logo: "/Binance_logo.svg" },
            { name: "Coinbase", logo: "/Coinbase_logo.svg" },
            { name: "KuCoin", logo: "/KUCOIN_logo.svg" },
            { name: "Kraken", logo: "/Kraken_logo.svg" },
            { name: "Crypto.com", logo: "/crypto-com_logo.svg" },
            { name: "Gemini", logo: "/Gemini_logo.png" },
          ].map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center rounded-lg border border-border bg-card p-6 h-24 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Blog Preview Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Latest from Our Blog
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stay updated with the latest news, insights, and guides on crypto
            staking
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Understanding Crypto Staking: A Beginner's Guide",
              excerpt:
                "Learn the fundamentals of crypto staking and how to get started earning passive income.",
              date: "Mar 15, 2024",
              slug: "understanding-crypto-staking",
              image: "https://images.unsplash.com/photo-1705234384094-0c047c1b2634?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              title: "ETH 2.0 Staking: What You Need to Know",
              excerpt:
                "Explore the benefits and considerations of staking Ethereum in the new proof-of-stake era.",
              date: "Mar 10, 2024",
              slug: "eth-2-staking-guide",
              image: "https://images.unsplash.com/photo-1705234384094-0c047c1b2634?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              title: "Maximizing Your Staking Rewards",
              excerpt:
                "Discover strategies to optimize your staking returns across different cryptocurrencies.",
              date: "Mar 5, 2024",
              slug: "maximizing-staking-rewards",
              image: "https://images.unsplash.com/photo-1705234384094-0c047c1b2634?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
          ].map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors"
            >
              <div className="aspect-video rounded-lg bg-muted mb-4 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <time className="text-xs text-muted-foreground">{post.date}</time>
              <h3 className="mt-2 text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center text-sm font-semibold text-primary">
                Read more <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>
      </div>

      {/* Site Footer */}
      <SiteFooter />
    </div>
  );
}
