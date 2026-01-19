"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, TrendingUp, Globe, Users, Zap, Lock, Target, Award } from "lucide-react"

export default function AboutPage() {
    const milestones = [
        { year: "2021", title: "Founded", description: "MINE & STAKE LIMITED established in the UK" },
        { year: "2022", title: "Platform Launch", description: "StakeBarn platform goes live with ETH staking" },
        { year: "2023", title: "Multi-Asset Support", description: "Added BTC, SOL, and XRP staking options" },
        { year: "2024", title: "Global Expansion", description: "Reached users in 50+ countries worldwide" },
        { year: "2025", title: "Enhanced Security", description: "Implemented advanced security protocols" },
    ]

    const stats = [
        { value: "$50M+", label: "Total Value Staked" },
        { value: "25,000+", label: "Active Stakers" },
        { value: "99.9%", label: "Platform Uptime" },
        { value: "50+", label: "Countries Served" },
    ]

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
                <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
                            About <span className="text-primary">StakeBarn</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
                            We're on a mission to make cryptocurrency staking accessible, secure, and rewarding for everyone.
                            Founded in 2021, StakeBarn has grown to become a trusted platform for crypto enthusiasts worldwide.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            At StakeBarn, we believe that earning passive income from cryptocurrency should be simple, transparent, and secure.
                            Our platform removes the technical barriers to staking, allowing anyone to participate in blockchain
                            networks and earn rewards.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            We're committed to providing the highest levels of security and transparency,
                            ensuring our users can stake with confidence while maintaining full visibility
                            into their assets and rewards.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: Shield, title: "Security First", desc: "Bank-grade security protocols" },
                            { icon: TrendingUp, title: "Competitive Rates", desc: "Industry-leading APY" },
                            { icon: Globe, title: "Global Access", desc: "Available worldwide" },
                            { icon: Zap, title: "Instant Setup", desc: "Start staking in minutes" },
                        ].map((item) => (
                            <div key={item.title} className="rounded-lg border border-border bg-card p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-semibold text-card-foreground">{item.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-card border-y border-border">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Roadmap Section */}
            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-foreground">Our Journey</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Building the future of crypto staking, one milestone at a time
                    </p>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <div key={milestone.year} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                                    <div className="rounded-lg border border-border bg-card p-6 inline-block">
                                        <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                                        <h3 className="text-lg font-semibold text-card-foreground">{milestone.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background hidden md:block" />
                                <div className="flex-1 hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-card border-y border-border">
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-foreground">Our Values</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {[
                            { icon: Lock, title: "Security", desc: "Your assets are protected with industry-leading security measures and regular audits." },
                            { icon: Target, title: "Transparency", desc: "We believe in complete transparency. Track every transaction and reward in real-time." },
                            { icon: Award, title: "Excellence", desc: "We continuously improve our platform to deliver the best staking experience possible." },
                        ].map((value) => (
                            <div key={value.title} className="text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                                    <value.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                                <p className="mt-4 text-muted-foreground">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-background border border-border p-12 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Staking?</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Join thousands of users earning passive income with StakeBarn. Get started in minutes.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Button asChild size="lg">
                            <Link href="/auth/sign-up">Create Account</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/learn">Learn More</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    )
}
