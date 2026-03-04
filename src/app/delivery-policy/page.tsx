
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function DeliveryPolicy() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-12 prose prose-slate dark:prose-invert">
                <h1 className="text-4xl font-bold mb-8">Delivery / Fulfilment Policy</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Digital Service Delivery</h2>
                    <p>
                        DJTECH provides digital SaaS services. Upon successful payment confirmation
                        from our payment gateway, access to the purchased service or subscription is
                        granted immediately.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Activation Process</h2>
                    <p>
                        Access is typically activated automatically. You will receive a confirmation
                        email with details on how to access your dashboard or premium features.
                        If your account requires manual verification, activation will be completed
                        within 24 hours of payment.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Hardware Delivery (If Applicable)</h2>
                    <p>
                        For any physical hardware components (such as pre-configured controllers),
                        shipping will be handled via reputable couriers within Malaysia. Shipping
                        typically takes 3-5 business days after order processing. Tracking information
                        will be provided once the item is shipped.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Non-Receipt of Digital Access</h2>
                    <p>
                        If you do not receive access within 1 hour of a successful payment, please
                        check your spam folder or contact our support team at: support@djtech.com
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
