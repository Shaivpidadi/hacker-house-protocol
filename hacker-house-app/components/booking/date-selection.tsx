"use client"

import { useState } from "react"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DateSelectionProps {
  propertyId: string
  onDatesSelected: (dates: { start: Date | null; end: Date | null }) => void
}

export function DateSelection({ propertyId, onDatesSelected }: DateSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(1)
  const [currentMonth] = useState("August 2025")

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)

  // Create calendar grid with proper spacing
  const calendarDays = []
  // August 2025 starts on a Friday (index 5)
  const startDay = 5

  // Add empty cells for days before the month starts
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null)
  }

  // Add the days of the month
  for (let day = 1; day <= 31; day++) {
    calendarDays.push(day)
  }

  const handleDateClick = (day: number) => {
    setSelectedDate(day)
  }

  const handleApply = () => {
    if (selectedDate) {
      const startDate = new Date(2025, 7, selectedDate) // August is month 7 (0-indexed)
      const endDate = new Date(2025, 7, selectedDate + 2) // Assuming 3-day stay
      onDatesSelected({ start: startDate, end: endDate })
    }
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
        <Link href={`/property/${propertyId}`}>
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 text-center">
          <h1 className="font-semibold text-lg">ETH Global Buenos Aires - Private room Palermo</h1>
          <p className="text-sm text-gray-500">August 15-17</p>
        </div>
        <Button variant="ghost" size="sm" className="p-2">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <h2 className="text-2xl font-bold mb-8">How long will you hack for?</h2>

        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" className="p-2">
            <X className="w-5 h-5" />
          </Button>
          <h3 className="font-semibold text-lg">Choose your dates</h3>
          <div className="w-10"></div>
        </div>

        {/* Calendar */}
        <div className="mb-8">
          <h4 className="font-semibold text-center mb-4">{currentMonth}</h4>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <div key={index} className="aspect-square">
                {day && (
                  <Button
                    variant={selectedDate === day ? "default" : "ghost"}
                    className={`w-full h-full rounded-full text-sm font-medium ${
                      selectedDate === day ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    {day}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <Button
          className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-base font-medium"
          onClick={handleApply}
          disabled={!selectedDate}
        >
          Apply
        </Button>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pb-4">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  )
}
