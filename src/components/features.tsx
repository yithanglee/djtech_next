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
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Works on</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4 ">
            <h3 className="text-xl font-semibold text-center">Token Changer</h3>
            <div className="aspect-video p-8">
              <video 
                className="w-full lg:h-full rounded-lg shadow-lg"
                controls
                preload="metadata"
              >
                <source src="/demo/demo1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div className="space-y-4 ">
            <h3 className="text-xl font-semibold text-center">Vending Machine</h3>
            <div className="aspect-video p-8">
              <video 
                className="w-full lg:h-full rounded-lg shadow-lg"
                controls
                preload="metadata"
              >
                <source src="/demo/demo2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center" style={{ marginTop: '10vh' }}>
          <h3 className="text-2xl font-semibold mb-4">Ready to Get Started?</h3>
          <p className="text-lg mb-6">Contact us on WhatsApp or email for more information</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/601154512919"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center p-4 gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact Us on WhatsApp
            </a>
            <a 
              href="mailto:jdtechmy@gmail.com"
              className="inline-flex items-center p-4 gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>


  )
}

