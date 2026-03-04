
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function SubscriptionPolicy() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-12 prose prose-slate dark:prose-invert">
                <h1 className="text-4xl font-bold mb-8">Subscription Policy</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Subscription Plans</h2>
                    <p>
                        DJTECH offers various subscription plans for our SaaS services. The details of
                        each plan, including features and limits, are provided at the time of purchase.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Billing Frequency</h2>
                    <p>
                        Subscriptions are billed on a recurring basis, either monthly or annually,
                        depending on your selection. Billing occurs at the start of each subscription
                        period.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Auto-Renewal</h2>
                    <p>
                        To ensure uninterrupted service, subscriptions are set to auto-renew by default.
                        You can disable auto-renewal at any time through your account settings.
                        If auto-renewal is disabled, your subscription will expire at the end of the
                        current billing cycle.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Cancellation Procedure</h2>
                    <p>
                        You may cancel your subscription at any time. To cancel:
                    </p>
                    <ol className="list-decimal pl-6">
                        <li>Log in to your DJTECH account.</li>
                        <li>Navigate to the &apos;Subscription&apos; or &apos;Account Settings&apos; section.</li>
                        <li>Select &apos;Cancel Subscription&apos; and follow the prompts.</li>
                    </ol>
                    <p className="mt-4">
                        Upon cancellation, your access will remain active until the end of the
                        paid period. No prorated refunds are provided for early cancellation.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Price Changes</h2>
                    <p>
                        We reserve the right to modify subscription fees. Any price changes will be
                        communicated to you at least 30 days in advance via email and will only
                        apply to your next renewal cycle.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">6. Grace Period</h2>
                    <p>
                        If a recurring payment fails, we provide a 7-day grace period to update
                        your payment information before service suspension.
                    </p>
                </section>

                <p className="text-sm text-muted-foreground mt-12">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
            </main>
            <Footer />
        </div>
    )
}
