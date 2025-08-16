import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

export const metadata: Metadata = {
  title: "CryptoReal - Crypto Rental & Co-Pay App",
  description: "Airbnb-like platform for crypto rentals and hackathon accommodations",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${workSans.variable} ${openSans.variable} antialiased`}>
      <body className="font-sans">
        <AuthProvider>
          <div className="min-h-screen bg-background">{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}
