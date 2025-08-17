"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SkillsVerification() {
  const credentials = ["Hackathon Winner NFTs", "Developer Certifications", "Community Badges"]

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-2xl font-bold mb-4">Verify Your Skills</h1>
          <p className="text-gray-600 mb-8">Prove your hacker credentials with NFTs</p>

          <p className="text-gray-700 mb-8">We'll scan for these credentials:</p>
        </div>

        {/* Credentials List */}
        <div className="space-y-6 mb-16">
          {credentials.map((credential) => (
            <div key={credential} className="text-center py-4">
              <p className="text-gray-700 font-medium">{credential}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-medium">
              Verify NFTs
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-base font-medium bg-transparent"
            >
              Do Later
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
