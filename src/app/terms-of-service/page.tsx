
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermsOfService() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-12 prose prose-slate dark:prose-invert">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Scope of Service</h2>
                    <p>
                        DJTECH provides SaaS solutions for smart device management and automation. Our services
                        include but are not limited to device connectivity, data visualization, and automated
                        workflows. By using our services, you agree to comply with these terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials
                        and for all activities that occur under your account. You agree to use the service
                        only for lawful purposes and in accordance with applicable laws in Malaysia.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Payment Terms</h2>
                    <p>
                        Subscription fees are billed in advance on a monthly or annual basis. All payments
                        are processed securely. Failure to pay may result in suspension or termination
                        of your access to the services.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Refund & Chargeback Policy</h2>
                    <p>
                        Refunds are handled according to our Refund Policy. Unauthorized chargebacks or
                        payment disputes will result in immediate account suspension and may lead to
                        permanent termination of service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by law, DJTECH shall not be liable for any indirect,
                        incidental, or consequential damages resulting from the use or inability to use our
                        services.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">6. Governing Law</h2>
                    <p>
                        These terms shall be governed by and construed in accordance with the laws of
                        Malaysia. Any disputes arising under these terms shall be subject to the exclusive
                        jurisdiction of the courts in Malaysia.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
                    <p>
                        We reserve the right to terminate or suspend your account at our sole discretion,
                        without notice, for conduct that we believe violates these Terms of Service or is
                        harmful to other users or our business interests.
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
