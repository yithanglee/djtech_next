import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import Script from "next/script";
import { FirebaseProvider } from "@/components/RegisterServiceWorker"; // Import the component

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DJTech',
  description: 'IoT Control Panel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >

      <body className={inter.className}>

        <AuthProvider>
          <FirebaseProvider>
            {children}
          </FirebaseProvider>
        </AuthProvider>

      </body>
    </html>
  )
}