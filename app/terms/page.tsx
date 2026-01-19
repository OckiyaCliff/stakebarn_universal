"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            <main className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Terms of Service
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Last updated: January 2025
                    </p>
                </div>

                <div className="prose prose-lg prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using StakeBarn's cryptocurrency staking platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">2. Service Description</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            StakeBarn provides a platform for cryptocurrency staking, allowing users to deposit supported cryptocurrencies and earn rewards. Our platform supports staking for various digital assets including ETH, BTC, SOL, and XRP.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">3. Eligibility</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>You must be at least 18 years old to use our Service</li>
                            <li>You must have the legal capacity to enter into binding contracts</li>
                            <li>You must not be a resident of any jurisdiction where cryptocurrency services are prohibited</li>
                            <li>You are responsible for ensuring compliance with local laws and regulations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">4. Account Responsibilities</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You are responsible for maintaining the security of your account credentials and any activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">5. Staking Terms</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p><strong className="text-foreground">Lock-up Periods:</strong> Some staking plans require your assets to be locked for a specified period. During this time, you may not be able to withdraw your staked assets.</p>
                            <p><strong className="text-foreground">Rewards:</strong> Staking rewards are calculated based on the APY advertised at the time of staking. Rewards are subject to change based on network conditions and market factors.</p>
                            <p><strong className="text-foreground">Minimum Stakes:</strong> Each staking plan may have minimum staking requirements that must be met.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">6. Risk Disclosure</h2>
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 space-y-3">
                            <p className="text-foreground font-semibold">Important Risk Warning:</p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Cryptocurrency investments are highly volatile and speculative</li>
                                <li>Past performance does not guarantee future results</li>
                                <li>You may lose some or all of your staked assets</li>
                                <li>Smart contract vulnerabilities could result in loss of funds</li>
                                <li>Regulatory changes may affect the availability of our services</li>
                                <li>Network issues or blockchain failures may impact withdrawals</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">7. Prohibited Activities</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Using the Service for money laundering or terrorist financing</li>
                            <li>Attempting to manipulate or exploit platform vulnerabilities</li>
                            <li>Using automated systems or bots without authorization</li>
                            <li>Impersonating other users or providing false information</li>
                            <li>Violating any applicable laws or regulations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">8. Fees and Charges</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may charge fees for certain services, including but not limited to withdrawal fees and platform service fees. All applicable fees will be clearly disclosed before you confirm any transaction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">9. Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To the maximum extent permitted by law, StakeBarn shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses resulting from your use of the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">10. Indemnification</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You agree to indemnify and hold harmless StakeBarn and its affiliates, officers, agents, and employees from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">11. Modifications to Service</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to modify, suspend, or discontinue any part of the Service at any time. We will provide reasonable notice of significant changes when possible.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">12. Governing Law</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">13. Contact Information</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            For questions about these Terms of Service, please contact us at legal@stakebarn.com.
                        </p>
                    </section>
                </div>
            </main>

            <SiteFooter />
        </div>
    )
}
