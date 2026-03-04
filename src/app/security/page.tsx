
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function SecurityStatement() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-12 prose prose-slate dark:prose-invert">
                <h1 className="text-4xl font-bold mb-8">Security & Data Protection</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Payment Security</h2>
                    <p>
                        At DJTECH, we prioritize the security of your financial information. All payments
                        are processed through secure FPX channels and reputable payment gateways.
                        <strong> We do not store your banking credentials, PINs, or passwords </strong>
                        on our servers.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. SSL Encryption</h2>
                    <p>
                        Our website utilizes Industry-standard SSL (Secure Sockets Layer) encryption
                        to ensure that all data transmitted between your browser and our servers
                        remains confidential and integrated.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Data Privacy (PDPA)</h2>
                    <p>
                        We are committed to protecting your personal data in compliance with the
                        Personal Data Protection Act (PDPA) 2010 of Malaysia. We only collect data
                        necessary for service delivery and do not sell your personal information
                        to third parties.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Redirection Safety</h2>
                    <p>
                        During the FPX payment process, you will be redirected to your respective
                        bank's secure payment portal. Please ensure you are on the official bank
                        URL before entering any credentials.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Continuous Monitoring</h2>
                    <p>
                        Our infrastructure is continuously monitored for security vulnerabilities and
                        unauthorized access attempts to ensure a safe environment for all our users.
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
