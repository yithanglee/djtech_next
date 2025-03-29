import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import Script from "next/script";

const inter = localFont({
  src: '../../public/fonts/Inter Variable/Inter.ttf',
  variable: '--font-inter',
})

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
    <html lang="en">
      <body className={`${inter.className} ${inter.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}