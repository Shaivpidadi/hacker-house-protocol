"use client"

import { useState } from "react"
import { DateSelection } from "./date-selection"
import { InviteHackers } from "./invite-hackers"

interface BookingFlowProps {
  propertyId: string
}

export function BookingFlow({ propertyId }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<"dates" | "invite">("dates")
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })

  const handleDatesSelected = (dates: { start: Date | null; end: Date | null }) => {
    setSelectedDates(dates)
    setCurrentStep("invite")
  }

  const handleBackToDates = () => {
    setCurrentStep("dates")
  }

  if (currentStep === "dates") {
    return <DateSelection propertyId={propertyId} onDatesSelected={handleDatesSelected} />
  }

  return <InviteHackers propertyId={propertyId} selectedDates={selectedDates} onBack={handleBackToDates} />
}
