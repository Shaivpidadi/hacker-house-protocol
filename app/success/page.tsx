import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 text-center">
        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Your share has been paid. Your booking reservation will not be completed until all guests have paid their
          payment split.
        </p>

        <Link href="/">
          <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
