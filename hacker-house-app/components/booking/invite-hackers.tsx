"use client"

import { useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface InviteHackersProps {
  propertyId: string
  selectedDates: { start: Date | null; end: Date | null }
  onBack: () => void
}

export function InviteHackers({ propertyId, selectedDates, onBack }: InviteHackersProps) {
  const [invitedHackers, setInvitedHackers] = useState<string[]>([])

  const handleAddHacker = () => {
    // In a real app, this would open a modal or navigate to a hacker selection screen
    setInvitedHackers([...invitedHackers, `Hacker ${invitedHackers.length + 1}`])
  }

  const formatDateRange = () => {
    if (!selectedDates.start || !selectedDates.end) return "August 15-17"

    const start = selectedDates.start.getDate()
    const end = selectedDates.end.getDate()
    return `August ${start}-${end}`
  }

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

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <Button variant="ghost" size="sm" className="p-2" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 text-center">
          <h1 className="font-semibold text-lg">ETH Global Buenos Aires - Private room Palermo</h1>
          <p className="text-sm text-gray-500">{formatDateRange()}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <h2 className="text-2xl font-bold mb-8">Invite Other Hackers!</h2>

        {/* Add Hacker Button */}
        <div className="mb-8">
          <Button
            variant="outline"
            className="w-full h-16 rounded-xl border-2 border-dashed border-gray-300 bg-transparent hover:bg-gray-50 flex items-center justify-center gap-3"
            onClick={handleAddHacker}
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-gray-600 font-medium">Add hacker</span>
          </Button>
        </div>

        {/* Invited Hackers List */}
        {invitedHackers.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Invited Hackers ({invitedHackers.length})</h3>
            <div className="space-y-3">
              {invitedHackers.map((hacker, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <span className="font-medium">{hacker}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Check Out Button */}
        <Link href={`/checkout/${propertyId}`}>
          <Button className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-base font-medium">
            Check Out
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
