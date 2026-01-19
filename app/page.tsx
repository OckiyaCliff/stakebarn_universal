"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Lock,
  Zap,
  Users,
  Globe,
  Award,
  ChevronDown,
  CheckCircle,
  Star,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

// FAQ Accordion Component
function FAQItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden hover-lift">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-foreground">{question}</span>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}>
        <p className="p-5 pt-0 text-muted-foreground bg-card">{answer}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = [
    { value: 50, suffix: "M+", label: "Total Value Staked" },
    { value: 25000, suffix: "+", label: "Active Stakers" },
    { value: 99, suffix: "%", label: "Platform Uptime" },
    { value: 50, suffix: "+", label: "Countries" },
  ];

  const testimonials = [
    {
      name: "Alex M.",
      role: "ETH Staker",
      content: "StakeBarn made staking so simple. I've been earning consistent rewards without any technical hassle.",
      rating: 5,
    },
    {
      name: "Sarah L.",
      role: "BTC Holder",
      content: "Finally found a platform I can trust with my Bitcoin. The security features give me peace of mind.",
      rating: 5,
    },
    {
      name: "James K.",
      role: "SOL Staker",
      content: "The APY rates are competitive and the dashboard makes tracking rewards a breeze. Highly recommend!",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "What is cryptocurrency staking?",
      answer: "Staking is the process of locking up your crypto assets to support blockchain network operations. In return, you earn rewards in the form of additional cryptocurrency."
    },
    {
      question: "How much can I earn from staking?",
      answer: "Earnings vary by cryptocurrency and staking plan. Our APY rates range from 12% to 22% depending on the asset and lock-up period you choose."
    },
    {
      question: "Is my cryptocurrency safe?",
      answer: "Yes. We use industry-leading security measures including encryption, multi-signature wallets, and regular security audits to protect your assets."
    },
    {
      question: "When can I withdraw my staked assets?",
      answer: "With flexible staking, you can withdraw anytime. Locked staking plans have fixed periods (30, 60, or 90 days) after which your assets become available."
    },
  ];

  const steps = [
    { number: "01", title: "Create Account", description: "Sign up in minutes with just your email" },
    { number: "02", title: "Deposit Crypto", description: "Transfer your crypto to your StakeBarn wallet" },
    { number: "03", title: "Start Earning", description: "Choose a plan and watch your rewards grow" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-slide-up">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Zap className="h-4 w-4 mr-2" />
                Trusted by 25,000+ stakers worldwide
              </span>
            </div>
            <h1 className="animate-slide-up animation-delay-100 text-5xl font-bold tracking-tight text-foreground sm:text-7xl text-balance">
              Stake your crypto.
              <span className="gradient-text"> Earn rewards.</span>
            </h1>
            <p className="animate-slide-up animation-delay-200 mt-6 text-lg leading-8 text-muted-foreground text-pretty max-w-2xl mx-auto">
              StakeBarn Universal offers secure, flexible staking for ETH, BTC,
              SOL, and XRP. Start earning passive income with competitive APYs
              and transparent rewards.
            </p>
            <div className="animate-slide-up animation-delay-300 mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Button asChild size="lg" className="gap-2 glow-primary">
                <Link href="/auth/sign-up">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/learn">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar - New */}
      <section className="border-y border-border bg-card/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - New */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start earning in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative text-center p-8 rounded-xl border border-border bg-card hover-lift"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold mb-6">
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Choose StakeBarn?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Professional staking platform with competitive rates and flexible terms
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: TrendingUp, title: "High APY", desc: "Earn up to 180% APY on your crypto holdings with our competitive staking plans" },
            { icon: Shield, title: "Secure", desc: "Your assets are protected with industry-leading security and blockchain verification" },
            { icon: Zap, title: "Flexible", desc: "Choose between flexible or locked staking plans that fit your investment strategy" },
            { icon: Lock, title: "Transparent", desc: "Real-time tracking of your deposits, stakes, and rewards with full transparency" },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="relative overflow-hidden rounded-xl border border-border bg-card p-6 hover-lift group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Currencies - Enhanced */}
      <section
        id="currencies"
        className="bg-card/50 border-y border-border"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Supported Cryptocurrencies
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stake your favorite assets with competitive returns
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { name: "Ethereum", symbol: "ETH", apy: "Up to 150%", color: "from-blue-500/20" },
              { name: "Bitcoin", symbol: "BTC", apy: "Up to 120%", color: "from-orange-500/20" },
              { name: "Solana", symbol: "SOL", apy: "Up to 180%", color: "from-purple-500/20" },
              { name: "Ripple", symbol: "XRP", apy: "Up to 140%", color: "from-gray-500/20" },
            ].map((currency) => (
              <div
                key={currency.symbol}
                className={`rounded-xl border border-border bg-gradient-to-br ${currency.color} to-transparent p-6 text-center hover-lift`}
              >
                <div className="text-3xl font-bold text-foreground">
                  {currency.symbol}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {currency.name}
                </div>
                <div className="mt-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {currency.apy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - New */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Thousands
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our stakers have to say
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="rounded-xl border border-border bg-card p-6 hover-lift"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">{testimonial.name[0]}</span>
                </div>
                <div>
                  <div className="font-medium text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section - New */}
      <section className="bg-card/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to know about staking
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Button asChild variant="outline">
              <Link href="/resources">View All Resources</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section
        id="partners"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Leading Exchanges
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our partners include the world's top cryptocurrency platforms
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
      </section>

      {/* Newsletter CTA - New */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-border p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Ready to Start Earning?
              </h2>
              <p className="text-muted-foreground">
                Join thousands of stakers earning passive income daily
              </p>
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              <Button asChild size="lg" className="glow-primary">
                <Link href="/auth/sign-up">
                  Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Latest from Our Blog
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stay updated with insights and guides on crypto staking
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Understanding Crypto Staking: A Beginner's Guide",
              excerpt: "Learn the fundamentals of crypto staking and how to get started earning passive income.",
              date: "Mar 15, 2024",
              slug: "understanding-crypto-staking",
              image: "https://images.unsplash.com/photo-1705234384094-0c047c1b2634?q=80&w=1170&auto=format&fit=crop",
            },
            {
              title: "ETH 2.0 Staking: What You Need to Know",
              excerpt: "Explore the benefits and considerations of staking Ethereum in the proof-of-stake era.",
              date: "Mar 10, 2024",
              slug: "eth-2-staking-guide",
              image: "https://images.unsplash.com/photo-1622790698141-94e30457ef12?q=80&w=1172&auto=format&fit=crop",
            },
            {
              title: "Maximizing Your Staking Rewards",
              excerpt: "Discover strategies to optimize your staking returns across different cryptocurrencies.",
              date: "Mar 5, 2024",
              slug: "maximizing-staking-rewards",
              image: "https://images.unsplash.com/photo-1641284624414-10c3ac93cd07?q=80&w=1172&auto=format&fit=crop",
            },
          ].map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-border bg-card overflow-hidden hover-lift"
            >
              <div className="aspect-video bg-muted overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <time className="text-xs text-muted-foreground">{post.date}</time>
                <h3 className="mt-2 text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center text-sm font-semibold text-primary">
                  Read more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
