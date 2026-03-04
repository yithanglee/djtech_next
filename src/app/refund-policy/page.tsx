
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function RefundPolicy() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-12 prose prose-slate dark:prose-invert">
                <h1 className="text-4xl font-bold mb-8">Refund & Cancellation Policy</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Subscription Cancellation</h2>
                    <p>
                        You may cancel your subscription at any time through your account settings. Upon
                        cancellation, you will continue to have access to the service until the end of
                        your current billing period.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Refund Conditions</h2>
                    <p>
                        Due to the digital nature of our SaaS products, we generally do not offer refunds
                        once a subscription has been activated or used. However, we may consider refund
                        requests under the following conditions:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Duplicate payments made in error.</li>
                        <li>Technical failures on our part that prevent you from accessing the service for an extended period.</li>
                        <li>Refund requests made within 7 days of the initial purchase, provided the service hasn&apos;t been significantly used.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. No Refund After Activation</h2>
                    <p className="bg-muted p-4 border-l-4 border-primary italic">
                        Please note: Once a subscription is activated and the service is accessed,
                        no refunds will be provided for that billing period.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Refund Process</h2>
                    <p>
                        If a refund is approved, it will be processed using the original method of payment.
                        Depending on your bank or payment gateway, it may take 7 to 14 business days for
                        the refund to appear in your account.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Contact for Refund Requests</h2>
                    <p>
                        To request a refund, please contact our support team at: support@djtech.com with
                        your account details and reason for the request.
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
