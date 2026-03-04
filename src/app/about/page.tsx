
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-12 prose prose-slate dark:prose-invert">
                <h1 className="text-4xl font-bold mb-8">About DJTECH</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                    <p>
                        DJTECH is committed to empowering businesses and individuals through
                        innovative smart connectivity solutions. We believe in making complex
                        technology accessible and manageable for everyone.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
                    <p>
                        We specialize in developing robust SaaS platforms for device monitoring,
                        automation, and data analytics. Our projects, micro controllers, including ESP32 and Raspberry Pi systems,
                        are designed to provide seamless integration and intelligent insights for
                        modern technology ecosystems.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
                    <p>
                        With years of experience in the technology sector, we prioritize security,
                        reliability, and user experience. Our team works tirelessly to ensure that
                        our infrastructure meets the highest standards of performance and data
                        integrity.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Legitimacy & Transparency</h2>
                    <p>
                        As a registered commercial entity in Malaysia, we adhere to all local
                        regulations and industry best practices. Transparency in our operations
                        and payment processes is central to our business values.
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    )
}
