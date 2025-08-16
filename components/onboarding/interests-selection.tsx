"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function InterestsSelection() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const interests = [
    "Meeting new people",
    "Making cool shit",
    "Hacking obviously",
    "Meeting new people",
    "Music",
    "Food",
    "Making cool shit",
    "Learning new things",
    "Making cool shit",
    "Meeting new people",
    "Making cool shit",
    "Hacking obviously",
    "Meeting new people",
    "Music",
    "Food",
    "Making cool shit",
  ]

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">What are your interests?</h1>
          <p className="text-gray-600">Choose 3 things that describe you best. Give us all the tea!</p>
        </div>

        {/* Interest Tags */}
        <div className="flex flex-wrap gap-3 mb-16">
          {interests.map((interest, index) => (
            <Button
              key={`${interest}-${index}`}
              variant={selectedInterests.includes(`${interest}-${index}`) ? "default" : "outline"}
              className={`rounded-full px-6 py-2 text-sm font-medium ${
                selectedInterests.includes(`${interest}-${index}`)
                  ? "bg-blue-600 text-white border-blue-600"
                  : interest === "Hacking obviously"
                    ? "bg-blue-100 text-blue-600 border-blue-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => toggleInterest(`${interest}-${index}`)}
            >
              {interest}
            </Button>
          ))}
        </div>

        {/* Next Button */}
        <Link href="/onboarding/verify">
          <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-medium">
            Next
          </Button>
        </Link>
      </div>
    </div>
  )
}
