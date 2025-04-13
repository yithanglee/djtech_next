import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="py-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          DJTECH
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="#features" className="text-muted-foreground hover:text-primary">
            Features
          </Link>
          <Link href="#pricing" className="text-muted-foreground hover:text-primary">
            Pricing
          </Link>
          <Link href="#contact" className="text-muted-foreground hover:text-primary">
            Contact
          </Link>
        </nav>
        <Link href="/login">Get Started</Link>
      </div>
    </header>
  )
}

