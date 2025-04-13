import Link from 'next/link'

export function Footer() {
  return (
    <footer className="py-6 px-6 bg-background">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-muted-foreground mb-4 md:mb-0">
          © 2024 - {new Date().getFullYear()} DJTECH. All rights reserved.
        </div>
        <nav className="flex space-x-4">
          <Link href="#" className="text-muted-foreground hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            Terms of Service
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  )
}

