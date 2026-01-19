"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Calculator, BookOpen, HelpCircle, ExternalLink,
    ChevronDown, FileText, Lightbulb, Shield
} from "lucide-react"
import { useState } from "react"

const faqs = [
    {
        question: "What is cryptocurrency staking?",
        answer: "Staking is the process of locking up your cryptocurrency to support blockchain network operations. In return, you earn rewards, typically in the form of additional cryptocurrency. It's a way to earn passive income from your crypto holdings."
    },
    {
        question: "How do I start staking on StakeBarn?",
        answer: "Getting started is simple: 1) Create an account, 2) Deposit your cryptocurrency, 3) Choose a staking plan that fits your goals, 4) Confirm your stake and start earning rewards. The entire process takes just a few minutes."
    },
    {
        question: "What is APY and how is it calculated?",
        answer: "APY stands for Annual Percentage Yield. It represents the total return you can expect on your staked assets over a year, including compound interest. Our APY rates vary by cryptocurrency and staking plan duration."
    },
    {
        question: "What's the difference between flexible and locked staking?",
        answer: "Flexible staking allows you to withdraw your assets at any time but typically offers lower APY. Locked staking requires you to commit your assets for a fixed period but offers higher rewards. Choose based on your liquidity needs."
    },
    {
        question: "Is my cryptocurrency safe on StakeBarn?",
        answer: "Yes. We implement industry-leading security measures including encryption, multi-signature wallets, and regular security audits. Your assets are protected by the same standards used by major financial institutions."
    },
    {
        question: "When do I receive my staking rewards?",
        answer: "Rewards are calculated continuously and credited to your account daily. You can view your accumulated rewards in real-time through your dashboard. Rewards can be withdrawn or restaked at any time."
    },
    {
        question: "Are there any fees for staking?",
        answer: "StakeBarn charges minimal fees that are clearly disclosed before you stake. There are no hidden fees. Withdrawal fees may apply depending on the cryptocurrency and network conditions."
    },
    {
        question: "What cryptocurrencies can I stake?",
        answer: "We currently support staking for Ethereum (ETH), Bitcoin (BTC), Solana (SOL), and Ripple (XRP). We're continuously adding support for more cryptocurrencies based on user demand."
    }
]

const glossary = [
    { term: "APY", definition: "Annual Percentage Yield - the total return on investment over one year, including compound interest" },
    { term: "Staking", definition: "Locking cryptocurrency to support blockchain operations in exchange for rewards" },
    { term: "Lock-up Period", definition: "The duration your assets must remain staked before withdrawal" },
    { term: "Validator", definition: "A node that validates transactions and secures the blockchain network" },
    { term: "Proof of Stake", definition: "A consensus mechanism where validators are chosen based on their stake" },
    { term: "Compound Interest", definition: "Earning interest on both your principal and accumulated interest" },
    { term: "Slashing", definition: "Penalty for validators who act maliciously or fail to perform duties" },
    { term: "Unbonding", definition: "The process of withdrawing staked assets, which may take time" },
]

const currencies = [
    { name: "Ethereum", symbol: "ETH", apy: 1.5 }, // 150%
    { name: "Bitcoin", symbol: "BTC", apy: 1.2 },  // 120%
    { name: "Solana", symbol: "SOL", apy: 1.8 },   // 180%
    { name: "Ripple", symbol: "XRP", apy: 1.4 },   // 140%
]

const periods = [
    { label: "Flexible", multiplier: 0.8 }, // Lower rewards for flexibility
    { label: "30 Days", multiplier: 1.0 },
    { label: "60 Days", multiplier: 1.1 },
    { label: "90 Days", multiplier: 1.2 },
]

function CalculatorComponent() {
    const [amount, setAmount] = useState<number>(1000)
    const [currencyIndex, setCurrencyIndex] = useState(0)
    const [periodIndex, setPeriodIndex] = useState(1)

    const selectedCurrency = currencies[currencyIndex]
    const selectedPeriod = periods[periodIndex]

    // Math: Principal * APY * Period Multiplier
    const annualReward = amount * selectedCurrency.apy * selectedPeriod.multiplier
    const monthlyEstimate = annualReward / 12

    return (
        <div className="rounded-lg border border-border bg-background p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Investment Amount (USD)</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Select Cryptocurrency</label>
                <select
                    value={currencyIndex}
                    onChange={(e) => setCurrencyIndex(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                >
                    {currencies.map((c, i) => (
                        <option key={c.symbol} value={i}>
                            {c.name} ({c.symbol}) - Up to {(c.apy * 100).toFixed(0)}% APY
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Staking Period</label>
                <select
                    value={periodIndex}
                    onChange={(e) => setPeriodIndex(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                >
                    {periods.map((p, i) => (
                        <option key={p.label} value={i}>
                            {p.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Estimated Annual Reward</span>
                    <span className="text-xl font-bold text-primary">
                        ${annualReward.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Monthly Estimate</span>
                    <span className="text-lg font-semibold text-foreground">
                        ${monthlyEstimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            <Button asChild className="w-full">
                <Link href="/auth/sign-up">Start Staking Now</Link>
            </Button>
        </div>
    )
}

export default function ResourcesPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
                <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            Resources
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Everything you need to become a successful crypto staker
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: BookOpen, title: "Learning Center", desc: "Master staking with our courses", href: "/learn" },
                        { icon: Calculator, title: "Staking Calculator", desc: "Estimate your potential rewards", href: "#calculator" },
                        { icon: HelpCircle, title: "FAQ", desc: "Answers to common questions", href: "#faq" },
                        { icon: FileText, title: "Glossary", desc: "Key terms explained", href: "#glossary" },
                    ].map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="group rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-all"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 font-semibold text-card-foreground group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Staking Calculator */}
            <section id="calculator" className="bg-card border-y border-border">
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground">Staking Calculator</h2>
                        <p className="mt-4 text-muted-foreground">Estimate your potential staking rewards</p>
                    </div>

                    <div className="mx-auto max-w-xl">
                        <CalculatorComponent />
                        <p className="mt-4 text-xs text-center text-muted-foreground">
                            *Estimates are for illustrative purposes only. Actual rewards may vary based on market conditions.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
                    <p className="mt-4 text-muted-foreground">Find answers to common questions about staking</p>
                </div>

                <div className="mx-auto max-w-3xl space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="rounded-lg border border-border bg-card overflow-hidden">
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-medium text-card-foreground">{faq.question}</span>
                                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                            </button>
                            {openFaq === index && (
                                <div className="px-6 pb-6">
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Glossary */}
            <section id="glossary" className="bg-card border-y border-border">
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground">Staking Glossary</h2>
                        <p className="mt-4 text-muted-foreground">Key terms every staker should know</p>
                    </div>

                    <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        {glossary.map((item) => (
                            <div key={item.term} className="rounded-lg border border-border bg-background p-4">
                                <h3 className="font-semibold text-foreground">{item.term}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{item.definition}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* External Resources */}
            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground">Helpful Resources</h2>
                    <p className="mt-4 text-muted-foreground">Learn more from trusted sources</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Ethereum Foundation", desc: "Official Ethereum staking documentation", url: "https://ethereum.org/staking" },
                        { title: "CoinMarketCap", desc: "Real-time cryptocurrency prices and data", url: "https://coinmarketcap.com" },
                        { title: "Blockchain Explorer", desc: "Track transactions on the blockchain", url: "https://etherscan.io" },
                    ].map((resource) => (
                        <a
                            key={resource.title}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                                    {resource.title}
                                </h3>
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">{resource.desc}</p>
                        </a>
                    ))}
                </div>
            </section>

            <SiteFooter />
        </div>
    )
}
