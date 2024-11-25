import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Cpu,
    title: "Smart Device Management",
    description: "Easily connect and manage all your IoT devices from a single dashboard."
  },
  {
    icon: Zap,
    title: "Real-time Analytics",
    description: "Get instant insights with our powerful real-time data analytics and visualization tools."
  },
  {
    icon: Shield,
    title: "Advanced Security",
    description: "Keep your devices and data safe with our state-of-the-art security protocols and encryption."
  }
]

export function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-muted">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

