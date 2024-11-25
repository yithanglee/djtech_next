
import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" >
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}

