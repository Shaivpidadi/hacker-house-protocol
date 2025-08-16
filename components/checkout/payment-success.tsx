"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm font-medium">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
          </div>
          <div className="w-6 h-3 border border-black rounded-sm">
            <div className="w-4 h-1.5 bg-black rounded-sm m-0.5"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        {/* Success Icon */}
        <div className="w-24 h-24 mb-8 flex items-center justify-center">
          <div className="w-16 h-16 bg-pink-600 rounded-lg flex items-center justify-center transform rotate-12">
            <div className="w-8 h-8 bg-white rounded"></div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 leading-relaxed">
            Your share has been paid. Your booking reservation will not be completed until all guests have paid their
            payment split.
          </p>
        </div>

        {/* Back to Home Button */}
        <Link href="/" className="w-full">
          <Button className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-base font-medium">
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pb-4">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  )
}
