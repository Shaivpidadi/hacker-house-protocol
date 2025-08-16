"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<string>("")

  const roles = ["Front-End Developer", "Back-End Developer", "Full Stack", "Product Designer"]

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-2xl font-bold mb-4">Pick your role</h1>
          <p className="text-gray-600">Tell us what type of hacker you are!</p>
        </div>

        {/* Role Options */}
        <div className="space-y-4 mb-16">
          {roles.map((role) => (
            <Button
              key={role}
              variant={selectedRole === role ? "default" : "outline"}
              className={`w-full h-14 rounded-xl text-base font-medium ${
                selectedRole === role
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </Button>
          ))}
        </div>

        {/* Next Button */}
        <Link href="/onboarding/interests">
          <Button
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-medium"
            disabled={!selectedRole}
          >
            Next
          </Button>
        </Link>
      </div>
    </div>
  )
}
