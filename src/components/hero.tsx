import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="py-20 px-6 text-center bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Empowering Vending Machines with E-Wallet Payments
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Affordable, maintenance-free e-wallet integration using just a static QR code.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/get-started">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/pricing">See Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

