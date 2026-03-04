import Link from 'next/link'

export function Footer() {
  return (
    <footer className="py-6 px-6 bg-background">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-muted-foreground mb-4 md:mb-0">
          © 2024 - {new Date().getFullYear()} DJTECH. All rights reserved.
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 mt-4 md:mt-0 text-sm">
          <Link href="/about" className="text-muted-foreground hover:text-primary whitespace-nowrap mr-2">
            About Us
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-primary whitespace-nowrap mr-2">
            Contact
          </Link>
          <Link href="/privacy_policy" className="text-muted-foreground hover:text-primary whitespace-nowrap mr-2">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary whitespace-nowrap mr-2">
            Terms of Service
          </Link>
          <Link href="/refund-policy" className="text-muted-foreground hover:text-primary whitespace-nowrap mr-2">
            Refund Policy
          </Link>
          <Link href="/delivery-policy" className="text-muted-foreground hover:text-primary whitespace-nowrap mr-2">
            Delivery Policy
          </Link>
          <Link href="/security" className="text-muted-foreground hover:text-primary whitespace-nowrap mr-2">
            Security
          </Link>
          <Link href="/subscription-policy" className="text-muted-foreground hover:text-primary whitespace-nowrap mr-2">
            Subscription Policy
          </Link>
        </nav>
      </div>
    </footer>
  )
}

