"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>

        <div className="prose prose-lg prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              StakeBarn ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cryptocurrency staking platform and related services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p><strong className="text-foreground">Personal Information:</strong> Email address, wallet addresses, and transaction history when you create an account and use our services.</p>
              <p><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our platform, including pages visited, time spent, and features used.</p>
              <p><strong className="text-foreground">Device Information:</strong> Browser type, IP address, device identifiers, and operating system for security and optimization purposes.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide and maintain our staking services</li>
              <li>To process your transactions and calculate rewards</li>
              <li>To communicate with you about your account and platform updates</li>
              <li>To detect and prevent fraud or unauthorized access</li>
              <li>To improve our platform and develop new features</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your personal information, including encryption, secure socket layer (SSL) technology, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may share information with trusted third-party service providers who assist us in operating our platform, processing transactions, or analyzing data. These parties are contractually obligated to maintain the confidentiality of your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability where technically feasible</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide services. We may also retain data as required by law or for legitimate business purposes such as resolving disputes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. International Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at privacy@stakebarn.com.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
