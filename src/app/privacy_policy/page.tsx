
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PrivacyPolicy() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-12 prose prose-slate dark:prose-invert">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                    <p>
                        At DJTECH, we respect your privacy and are committed to protecting your personal data.
                        This Privacy Policy will inform you as to how we look after your personal data when you
                        visit our website and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. The Data We Collect</h2>
                    <p>
                        We may collect, use, store and transfer different kinds of personal data about you which
                        we have grouped together as follows:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Identity Data includes first name, last name, username or similar identifier.</li>
                        <li>Contact Data includes email address and telephone numbers.</li>
                        <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
                        <li>Usage Data includes information about how you use our website, products and services.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use
                        your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being
                        accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy or our privacy practices, please
                        contact us at: support@djtech.com
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
