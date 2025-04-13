import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Smartphone, Timer } from 'lucide-react'

const features = [
  {
    icon: QrCode,
    title: "Attach Static QR Sticker",
    description: "Simply attach the provided QR code sticker or generate one online for your vending machine."
  },
  {
    icon: Smartphone,
    title: "Customer Scans & Pays",
    description: "Customers scan the QR code and make instant payments through their preferred e-wallet."
  },
  {
    icon: Timer,
    title: "Receive Payment Instantly",
    description: "Dispense items immediately after payment confirmation."
  }
]

export function Features() {
  return (
    <section id="features" className="py-10 px-6 bg-muted">
      <div className="container mx-auto bg-white" style={{ padding: '4vh 0' }}>
        <h2 className="text-3xl font-bold text-center mb-12 mt-6" >How It Works</h2>
        <div className="flex flex-col gap-4 items-center">
          <div className="grid grid-cols-12 lg:grid-cols-6">
            <img src="/images/qr-sticker-step.png" alt="QR Code" className="col-span-6 mx-auto " />
            <div className="flex justify-between items-center col-span-6 gap-4 mx-auto">
              <div className="text-center">


                <div className="text-center text-lg font-bold">Attach Static QR Sticker</div>
                <div className="text-center text-sm">Simply attach the provided QR code sticker or generate one online for your vending machine.</div>

              </div>
              <div className="text-center">
                <div className="text-center text-lg font-bold">Customer Scans & Pays</div>
                <div className="text-center text-sm">Customers scan the QR code and make instant payments through their preferred e-wallet.</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 lg:grid-cols-6">
            <img src="/images/scan-pay-step.png" alt="QR Code" className="col-span-6 mx-auto w-full" />
            <div className="flex justify-between items-center col-span-6 gap-4 mx-auto">
              <div className="text-center">

                <div className="text-center text-lg font-bold">Receive Payment Instantly</div>
                <div className="text-center text-sm">Dispense items immediately after payment confirmation.</div>

              </div>

            </div>
          </div>



        </div>

      </div>

      <div className="grid gap-8 md:grid-cols-3 hidden">
        {features.map((feature, index) => (
          <Card key={index} className="border-none bg-transparent">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <feature.icon className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-sm">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
        Demo Video coming soon
      </div>
    </section>


  )
}

