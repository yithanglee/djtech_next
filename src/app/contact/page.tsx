
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-12 prose prose-slate dark:prose-invert">
                <h1 className="text-4xl font-bold mb-8">Contact Information</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Official Entity Details</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="font-bold">Registered Company Name:</p>
                                <p>DJ TECH PLT</p>
                            </div>
                            <div>
                                <p className="font-bold">Business Registration Number (SSM):</p>
                                <p>202404001400 (LLP0038890-LGN)</p>
                            </div>
                            <div>
                                <p className="font-bold">Registered Business Address:</p>
                                <p>
                                    No.65 Jalan SL9/9D, Bandar Sg Long,<br />
                                    43000 Kajang, Selangor<br />
                                    Malaysia
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Get In Touch</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="font-bold">Contact Email:</p>
                                <p>jdtechmy@gmail.com</p>
                            </div>
                            <div>
                                <p className="font-bold">Contact Phone:</p>
                                <p>+60162056662</p>
                            </div>
                            <div>
                                <p className="font-bold">Business Hours:</p>
                                <p>Monday - Friday: 9:00 AM - 6:00 PM (GMT+8)</p>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">Location</h2>
                    <p className="text-muted-foreground italic">
                        Physical visitation is by appointment only. Please contact us via email
                        to schedule a meeting.
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
