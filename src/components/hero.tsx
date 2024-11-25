import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="py-20 px-6 text-center bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Connect Your World with IoTConnect
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Seamlessly integrate and manage your IoT devices with our powerful, user-friendly platform.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg">Start Free Trial</Button>
          <Button size="lg" variant="outline">Watch Demo</Button>
        </div>
      </div>
    </section>
  )
}

